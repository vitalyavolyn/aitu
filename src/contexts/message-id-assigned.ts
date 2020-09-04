import { Update, Peer } from '../interfaces'
import { Context } from './context'
import { PeerType } from '../types'
import { SendMessageParams, EditMessageParams } from '../api'
import { pickProperties } from '../utils'

export interface MessageIdAssignedUpdate extends Update {
  type: 'MessageIdAssigned'
  id: string
  localId: string
  dialog: Peer
}

export type MessageIdAssignedContextPayload = MessageIdAssignedUpdate
export type MessageIdAssignedContextType = MessageIdAssignedContextPayload['type']

export class MessageIdAssignedContext extends Context<
MessageIdAssignedContextPayload, MessageIdAssignedContextType
> {
  public get id (): string {
    return this.payload.id
  }

  public get localId (): string {
    return this.payload.localId
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

  /** Send a message to the dialog */
  public async send (
    content: string | SendMessageParams,
    params?: Partial<SendMessageParams>
  ): Promise<{}> {
    const options: SendMessageParams = {
      recipient: this.chat,

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
      messageId: this.id,

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
      'id',
      'localId',
      'dialog'
    ])
  }
}
