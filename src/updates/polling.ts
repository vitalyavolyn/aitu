import createDebug from 'debug'
import fetch from 'node-fetch'
import AbortController from 'abort-controller'

import { Updates } from '.'
import { ApiError } from '../errors'
import { AituOptions } from '../interfaces'
import { UpdateResponse } from '../types'

const debug = createDebug('aitu:updates')

export class PollingTransport {
  public isStarted = false

  private retries = 0

  public constructor (
    private handleUpdate: Updates['handleUpdate'],
    private options: AituOptions
  ) {}

  public async start (): Promise<void> {
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

        if (this.retries === this.options.pollingRetryLimit) {
          throw error
        }

        this.retries = this.retries + 1
      }
    }
  }

  public stop (): void {
    this.isStarted = false
  }

  private async fetchUpdates () {
    const { apiBaseUrl, pollingTimeout, agent, token } = this.options

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
    this.retries = 0

    if (updates.length === 0) return

    updates.forEach((update) => this.handleUpdate(update))
  }
}
