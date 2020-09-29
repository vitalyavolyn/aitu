import * as http from 'http'
import createDebug from 'debug'
import { Middleware, compose, noopNext, Composer, MiddlewareReturn } from 'middleware-io'
import { inspectable } from 'inspectable'

import { Aitu } from '../aitu'
import { UpdateType, Constructor, AllowArray } from '../types'
import { Update } from '../interfaces'
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
  QuickButtonSelectedContextType,

  FormContext,
  FormContextType
} from '../contexts'
import { PollingTransport, WebhookTransport, WebhookTransportOptions } from '.'

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
  ],
  [
    ['FormClosed', 'FormMessageSent', 'FormSubmitted'],
    FormContext
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

export class Updates {
  private aitu: Aitu
  private pollingTransport: PollingTransport
  private webhookTransport: WebhookTransport

  public composer = Composer.builder<Context>()
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

    this.pollingTransport = new PollingTransport(
      this.handleUpdate.bind(this),
      this.aitu.options
    )

    this.webhookTransport = new WebhookTransport(
      this.handleUpdate.bind(this),
      this.aitu.options
    )
  }

  public get isStarted (): boolean {
    return this.pollingTransport.isStarted || this.webhookTransport.isStarted
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

  public on<T = {}> (
    events: AllowArray<FormContextType>,
    handlers: AllowArray<Middleware<FormContext & T>>
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

    return this.use((context, next): MiddlewareReturn => (
      context.is(events)
        ? handler(context, next)
        : next()
    ))
  }

  public stop (): void {
    this.pollingTransport.stop()
  }

  /** Start updates fetch loop */
  public async startPolling (): Promise<void> {
    this.pollingTransport.start()
  }

  public async startWebhook (options: WebhookTransportOptions): Promise<void> {
    this.webhookTransport.start(options)
  }

  private async handleUpdate (update: Update): Promise<void> {
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

  public dispatchMiddleware (context: Context): MiddlewareReturn {
    return this.composed(context, noopNext)
  }

  protected recompose (): void {
    this.composed = this.composer.compose()
  }

  /**
   * Returns webhook callback like http[s] or express
   */
  public getWebhookCallback (path?: string): (
    req: http.IncomingMessage,
    res: http.ServerResponse,
    next?: (() => void) | undefined
  ) => Promise<void> {
    return this.webhookTransport.getWebhookCallback(path)
  }

  /**
   * Returns the middleware for the webhook under koa
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public getKoaWebhookMiddleware (): (context: any) => Promise<void> {
    return this.webhookTransport.getKoaWebhookMiddleware()
  }
}

inspectable(Updates, {
  serialize: ({ isStarted, composer }) => ({
    isStarted,
    composer
  })
})
