import { InlineCommandSelectedUpdate, Peer } from '../interfaces'
import { Context } from './context'
import { SendMessageParams, EditMessageParams } from '../api'
import { PeerType } from '../types'
import { pickProperties } from '../utils'

export type InlineCommandSelectedContextPayload = InlineCommandSelectedUpdate
export type InlineCommandSelectedContextType = InlineCommandSelectedContextPayload['type']

export class InlineCommandSelectedContext extends Context<
InlineCommandSelectedContextPayload, InlineCommandSelectedContextType
> {
  public get messageId (): string {
    return this.payload.messageId
  }

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

  public get content (): string {
    return this.payload.content
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

  public async editMessage (
    content: string | EditMessageParams,
    params?: Partial<EditMessageParams>
  ): Promise<{}> {
    const options: EditMessageParams = {
      recipient: this.dialog,
      messageId: this.messageId,

      ...(
        typeof content === 'string'
          ? { content, ...params }
          : content
      )
    }

    return this.aitu.api.EditMessage(options)
  }

  public serialize (): Record<string, unknown> {
    return pickProperties(this, [
      'messageId',
      'dialog',
      'sender',
      'metadata',
      'content'
    ])
  }
}
