import createDebug from 'debug'
import fetch from 'node-fetch'
import AbortController from 'abort-controller'
import { Middleware, compose, noopNext, Composer } from 'middleware-io'
import { inspectable } from 'inspectable'

import { Aitu } from './aitu'
import { UpdateResponse, UpdateType, Constructor, AllowArray } from './types'
import { Update } from './interfaces'
import {
  Context,

  MessageContext,
  MessageContextType,

  KickInviteContext,
  KickInviteContextType,

  ChannelAdminContext,
  ChannelAdminContextType,

  NewChannelSubscriberContext,
  NewChannelSubscriberContextType,

  ChannelPermissionsContext,
  ChannelPermissionsContextType,

  InlineCommandSelectedContext,
  InlineCommandSelectedContextType,

  MessageIdAssignedContext,
  MessageIdAssignedContextType,

  QuickButtonSelectedContext,
  QuickButtonSelectedContextType
} from './contexts'
import { ApiError } from './errors'

const debug = createDebug('aitu:updates')

const rawContexts: [UpdateType[], Constructor<Context>][] = [
  [
    ['Message', 'MessageEdited'],
    MessageContext
  ],
  [
    ['InvitedToGroup', 'InvitedToChannel', 'KickedFromChannel', 'KickedFromGroup'],
    KickInviteContext
  ],
  [
    ['ChannelAdminAdded', 'ChannelAdminDeleted'],
    ChannelAdminContext
  ],
  [
    ['NewChannelSubscriber'],
    NewChannelSubscriberContext
  ],
  [
    ['ChannelPermissionsGranted', 'ChannelPermissionsRevoked'],
    ChannelPermissionsContext
  ],
  [
    ['InlineCommandSelected'],
    InlineCommandSelectedContext
  ],
  [
    ['MessageIdAssigned'],
    MessageIdAssignedContext
  ],
  [
    ['QuickButtonSelected'],
    QuickButtonSelectedContext
  ]
]

function makeContexts (groups: [UpdateType[], Constructor<Context>][]) {
  const contexts: Record<string, Constructor<Context>> = {}

  for (const [events, context] of groups) {
    for (const event of events) {
      contexts[event] = context
    }
  }

  return contexts
}

const contexts = makeContexts(rawContexts)

// TODO: support webhooks, move polling to separate class
export class Updates {
  private readonly aitu: Aitu

  /** Is polling started? */
  public isStarted = false

  private retries = 0

  private composer = Composer.builder<Context>()
    .caught((context, error) => {
      debug('composer error', error)
    })

  private composed: Middleware<Context>

  public constructor (aitu: Aitu) {
    this.aitu = aitu

    // it could've been just a this.recompose(),
    // but typescript hates that this.composed
    // is not initialized in the constructor
    this.composed = this.composer.compose()
  }

  public use<T = Context> (middleware: Middleware<Context & T>): this {
    if (typeof middleware !== 'function') {
      throw new TypeError('Middleware must be a function')
    }

    this.composer.use(middleware)

    this.recompose()

    return this
  }

  public on<T = {}> (
    events: AllowArray<MessageContextType>,
    handlers: AllowArray<Middleware<MessageContext & T>>
  ): this

  public on<T = {}> (
    events: AllowArray<KickInviteContextType>,
    handlers: AllowArray<Middleware<KickInviteContext & T>>
  ): this

  public on<T = {}> (
    events: AllowArray<ChannelAdminContextType>,
    handlers: AllowArray<Middleware<ChannelAdminContext & T>>
  ): this

  public on<T = {}> (
    events: AllowArray<NewChannelSubscriberContextType>,
    handlers: AllowArray<Middleware<NewChannelSubscriberContext & T>>
  ): this

  public on<T = {}> (
    events: AllowArray<ChannelPermissionsContextType>,
    handlers: AllowArray<Middleware<ChannelPermissionsContext & T>>
  ): this

  public on<T = {}> (
    events: AllowArray<InlineCommandSelectedContextType>,
    handlers: AllowArray<Middleware<InlineCommandSelectedContext & T>>
  ): this

  public on<T = {}> (
    events: AllowArray<MessageIdAssignedContextType>,
    handlers: AllowArray<Middleware<MessageIdAssignedContext & T>>
  ): this

  public on<T = {}> (
    events: AllowArray<QuickButtonSelectedContextType>,
    handlers: AllowArray<Middleware<QuickButtonSelectedContext & T>>
  ): this

  public on (
    rawEvents: AllowArray<UpdateType | string>,
    rawHandlers: AllowArray<Middleware<Context>>
  ): this {
    const events = Array.isArray(rawEvents) ? rawEvents : [rawEvents]
    if (!events.every(Boolean)) {
      throw new TypeError('Events must be not empty')
    }

    const handler = Array.isArray(rawHandlers) ? compose(rawHandlers) : rawHandlers
    if (typeof handler !== 'function') {
      throw new TypeError('Handler must be a function')
    }

    return this.use((context, next): unknown => (
      context.is(events)
        ? handler(context, next)
        : next()
    ))
  }

  public stopPolling (): void {
    this.isStarted = false
  }

  /** Start updates fetch loop */
  public async startPolling (): Promise<void> {
    if (this.isStarted) {
      throw new Error('Polling is already started')
    }

    this.isStarted = true
    debug('Start polling')

    try {
      await this.startFetchLoop()
    } catch (error) {
      this.isStarted = false

      throw error
    }
  }

  private async startFetchLoop () {
    while (this.isStarted) {
      try {
        await this.fetchUpdates()
      } catch (error) {
        debug('startFetchLoop:', error)

        if (this.retries === this.aitu.options.pollingRetryLimit) {
          throw error
        }

        this.retries = this.retries + 1
      }
    }
  }

  private async fetchUpdates () {
    const { apiBaseUrl, pollingTimeout, agent, token } = this.aitu.options

    const headers = { 'x-bot-token': token }

    const abortController = new AbortController()
    const timeout = setTimeout(() => abortController.abort(), pollingTimeout)

    const response = await fetch(`${apiBaseUrl}/updates`, {
      headers,
      agent,
      signal: abortController.signal
    })

    clearTimeout(timeout)

    const responseJson = await response.text()
    let updateResponse: UpdateResponse
    try {
      updateResponse = JSON.parse(responseJson)
    } catch (error) {
      debug('JSON parsing error', responseJson)
      throw error
    }

    // debug('updateResponse', updateResponse)

    if (!('updates' in updateResponse)) {
      const { status, message } = updateResponse
      throw new ApiError({ status, message })
    }

    const { updates } = updateResponse

    if (updates.length === 0) return

    updates.forEach((update) => this.handleUpdate(update))
  }

  private async handleUpdate (update: Update) {
    debug('update', update)
    const { type } = update

    const UpdateContext: Constructor<Context> = contexts[type]

    if (!UpdateContext) {
      debug(`Unsupported context type ${type}`)

      return
    }

    const context = new UpdateContext({
      aitu: this.aitu,
      payload: update,
      type
    })

    debug(context, context.type)

    this.dispatchMiddleware(context)
  }

  public dispatchMiddleware (context: Context): unknown {
    return this.composed(context, noopNext)
  }

  protected recompose (): void {
    this.composed = this.composer.compose()
  }
}

inspectable(Updates, {
  // @ts-expect-error
  serialize: ({ isStarted, composer }) => ({
    isStarted,
    composer
  })
})
