import { Update, Peer } from '../interfaces'
import { Context } from './context'
import { SendMessageParams } from '../api'
import { PeerType } from '../types'
import { pickProperties } from '../utils'
import { FormMessage, QuickButtonCommand, KeyboardBuilder, ContainerMessage } from '../structures'

export interface QuickButtonSelectedUpdate extends Update {
  type: 'QuickButtonSelected'
  dialog: Peer
  sender: Peer
  metadata: string
}

export type QuickButtonSelectedContextPayload = QuickButtonSelectedUpdate
export type QuickButtonSelectedContextType = QuickButtonSelectedContextPayload['type']

export class QuickButtonSelectedContext extends Context<QuickButtonSelectedContextPayload> {
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

  /** Send a form without sending a message */
  public async sendForm (formMessage: FormMessage): Promise<{}> {
    return this.aitu.api.SendUiState({
      uiState: { formMessage },
      recipient: this.chat
    })
  }

  /** Send quick buttons without sending a message */
  public async sendQuickButtons (
    quickButtonCommands: QuickButtonCommand[] | KeyboardBuilder
  ): Promise<{}> {
    return this.aitu.api.SendUiState({
      uiState: { quickButtonCommands },
      recipient: this.chat
    })
  }

  /** Send a container message to the dialog */
  public async sendContainerMessage (content: ContainerMessage): Promise<{}> {
    return this.aitu.api.SendContainerMessage({ content, recipient: this.chat })
  }

  public serialize (): Record<string, unknown> {
    return pickProperties(this, [
      'dialog',
      'sender',
      'metadata'
    ])
  }
}
