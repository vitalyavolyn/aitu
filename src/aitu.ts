import { globalAgent } from 'https'
import AbortController from 'abort-controller'
import createDebug from 'debug'
import fetch, { Response } from 'node-fetch'
import { inspectable } from 'inspectable'

import { AituOptions, ApiObject } from './interfaces'
import { Updates } from './updates'
import { ApiMethod } from './types'
import { ApiRequestParams } from './api'
import { ApiError } from './errors'

// @ts-ignore: ts doesn't like json files outside of rootDir
import { name, version, repository } from '../package.json'

const defaultOptions: Partial<AituOptions> = {
  agent: globalAgent,
  apiBaseUrl: 'https://messapi.btsdapps.net/bot/v1',
  apiTimeout: 30000,
  apiHeaders: {
    'User-Agent': `${name}/${version} (+${repository.url})`
  },
  pollingTimeout: 40000,
  pollingRetryLimit: 3
}

const debug = createDebug('aitu:api')

export class Aitu {
  public options: AituOptions

  public updates: Updates

  /**
   * Call Aitu API
   *
   * @example
   * aitu.api.SendMessage({ content: 'text', recipient: { type: 'USER', id: 'uuid' } })
   * // same as
   * aitu.api('SendMessage', { content: 'text', recipient: { type: 'USER', id: 'uuid' } })
   */
  // @ts-expect-error: proxy target is not an ApiObject, but it doesn't matter anyway
  public readonly api = new Proxy<ApiObject>(() => {}, {
    // redirect api.method(params) to api(method, params)
    get: (_target, method: ApiMethod) => <T extends ApiMethod>(
      params: ApiRequestParams<T>
    ) => {
      return this.api(method, params)
    },

    // this function is executed when aitu.api() is called
    apply: async <T extends ApiMethod>(
      _target: ApiObject, _this: Aitu, [method, params]: [T, ApiRequestParams<T>]
    ) => {
      const { apiBaseUrl, apiHeaders, apiTimeout, agent, token } = this.options

      const headers = {
        ...apiHeaders,
        'x-bot-token': token,
        'content-type': 'application/json'
      }

      const methodUrls: Record<string, string> = {
        getMe: '/getMe',
        getChannelInfo: '/channels/{channelId}',
        getChannelAdmins: '/channels/{channelId}/admins',
        getChannelMessages: '/channels/{channelId}/messages',
        getWebhookInfo: '/webhook',
        setWebhook: '/webhook',
        deleteWebhook: '/webhook',
        getAvatar: '/user/{userId}/avatar/'
      }

      const methodTypes: Record<string, string> = {
        setWebhook: 'POST',
        deleteWebhook: 'DELETE'
      }

      // TODO: maybe have an array of commands?
      const isCommand = method[0].toUpperCase() === method[0]

      const httpMethod = isCommand
        ? 'POST'
        : methodTypes[method] ?? 'GET'

      let url = apiBaseUrl + (methodUrls[method] ?? '/updates')

      if (httpMethod === 'GET') {
        const query = new URLSearchParams()

        for (const param in params) {
          if (url.includes(`{${param}}`)) {
            url = url.replace(`{${param}}`, String(params[param]))
          } else {
            query.append(param, String(params[param]))
          }
        }

        url = `${url}?${query.toString()}`
      }

      const emptyRequiredParams = url.match(/{([a-z]+)}/i)
      if (emptyRequiredParams) {
        throw new TypeError(`Required parameter "${emptyRequiredParams[1]}" is not present`)
      }

      const body = isCommand
        ? JSON.stringify({
          commands: [{
            type: method,
            ...(params ?? {})
          }]
        })
        : (httpMethod === 'POST'
          ? JSON.stringify(params)
          : undefined)

      debug(`[${method}] --> ${httpMethod} ${url}`)
      if (body) debug(`[${method}] Params: ${body}`)

      // request timeout
      const abortController = new AbortController()
      const timeout = setTimeout(() => abortController.abort(), apiTimeout)

      let response: Response

      try {
        response = await fetch(url, {
          method: httpMethod,
          signal: abortController.signal,
          agent,
          body,
          headers
        })
      } catch (error) {
        debug(error)
        throw error
      } finally {
        clearTimeout(timeout)
      }

      const json = await response!.json()

      debug(`[${method}] Response:`, json)

      if (!json.error) return json

      const { status, message } = json.error
      throw new ApiError({ status, message })
    }
  })

  public constructor (options: AituOptions) {
    this.options = {
      ...defaultOptions,
      ...options
    }

    this.updates = new Updates(this)
  }

  public setOptions (options: Partial<AituOptions>): this {
    Object.assign(this.options, options)

    return this
  }
}

inspectable(Aitu, {
  serialize: ({ api, updates }) => ({ api, updates })
})
