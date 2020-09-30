import createDebug from 'debug'
import * as http from 'http'
import * as https from 'https'
import { TlsOptions } from 'tls'

import { Updates } from '.'
import { UpdatesPayload, AituOptions, Update } from '../interfaces'
import { parseReqJSON } from '../utils'

const debug = createDebug('aitu:updates')

export interface WebhookTransportOptions {
  path?: string
  port?: number
  tls?: TlsOptions
}

export class WebhookTransport {
  public isStarted = false
  protected webhookServer?: http.Server | https.Server

  public constructor (
    private handleUpdate: Updates['handleUpdate'],
    private options: AituOptions
  ) {}

  public async start (options: WebhookTransportOptions): Promise<void> {
    this.isStarted = true

    try {
      const { path, tls, port } = options

      const cb = this.getWebhookCallback(path)

      const server = tls
        ? https.createServer(tls, cb)
        : http.createServer(cb)

      this.webhookServer = server

      const listeningPort = port ?? (tls ? 443 : 80)
      server.listen(listeningPort, () => {
        debug(`Server listening on port ${listeningPort}`)
      })
    } catch (error) {
      this.isStarted = false
      throw error
    }
  }

  public async stop (): Promise<void> {
    this.isStarted = false

    if (this.webhookServer) {
      this.webhookServer.close(() => {
        this.webhookServer = undefined
      })
    }
  }

  /**
   * Returns callback for http[s] or express
   */
  public getWebhookCallback (path = '/') {
    return async (
      req: http.IncomingMessage,
      res: http.ServerResponse,
      next?: () => void
    ): Promise<void> => {
      debug('request', req.url)
      if (req.method !== 'POST' || req.url !== path) {
        if (typeof next === 'function') {
          return next()
        }

        res.statusCode = 403
        return res.end()
      }

      const reqBody = (req as http.IncomingMessage & { body: UpdatesPayload | string }).body

      try {
        const body: UpdatesPayload = typeof reqBody === 'object'
          ? reqBody
          : await parseReqJSON(req) as UpdatesPayload

        debug(body)

        body.updates.forEach((update) => this.handleUpdate(update))

        res.statusCode = 200
        res.end()
      } catch (error) {
        debug(error)
      }
    }
  }

  public getKoaWebhookMiddleware () {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return async (context: any): Promise<void> => {
      const body = context.request.body
      const { updates } = typeof body === 'object'
        ? body
        : await parseReqJSON(context.req)

      updates.forEach((update: Update) => this.handleUpdate(update))
      context.body = 'ok'
    }
  }
}
