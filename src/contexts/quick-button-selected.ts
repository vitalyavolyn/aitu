import { QuickButtonSelectedUpdate, Peer } from '../interfaces'
import { Context } from './context'
import { SendMessageParams } from '../api'
import { PeerType } from '../types'
import { pickProperties } from '../utils'

export type QuickButtonSelectedContextPayload = QuickButtonSelectedUpdate
export type QuickButtonSelectedContextType = QuickButtonSelectedContextPayload['type']

export class QuickButtonSelectedContext extends Context<
QuickButtonSelectedContextPayload, QuickButtonSelectedContextType
> {
  public get dialog (): Peer {
    return this.payload.dialog
  }

  public get chat (): Peer {
    return this.dialog
  }

  public get chatType (): PeerType {
    return this.chat.type
  }

  public get isPM (): boolean {
    return this.chatType === 'USER'
  }

  public get isGroup (): boolean {
    return this.chatType === 'GROUP'
  }

  public get isChannel (): boolean {
    return this.chatType === 'CHANNEL'
  }

  public get sender (): Peer {
    return this.payload.sender
  }

  public get metadata (): string {
    return this.payload.metadata
  }

  /** Send a message to the dialog */
  public async send (
    content: string | SendMessageParams,
    params?: Partial<SendMessageParams>
  ): Promise<{}> {
    const options: SendMessageParams = {
      recipient: this.dialog,

      ...(
        typeof content === 'string'
          ? { content, ...params }
          : content
      )
    }

    return this.aitu.api.SendMessage(options)
  }

  public serialize (): Record<string, unknown> {
    return pickProperties(this, [
      'dialog',
      'sender',
      'metadata'
    ])
  }
}
