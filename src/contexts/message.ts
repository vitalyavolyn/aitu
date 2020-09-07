import { Context, ContextOptions } from './context'
import { SendMessageParams } from '../api'
import { Peer, Update } from '../interfaces'
import { PeerType } from '../types'
import {
  Media,
  ImageMedia,
  VideoMedia,
  DocumentMedia,
  AudioMedia,
  ContactMedia,

  MediaType,
  MediaPayload,
  RegisteredContactPayload,
  UnregisteredContactPayload,
  FormMessage,
  ContainerMessage,
  QuickButtonCommand,
  KeyboardBuilder
} from '../structures'
import { pickProperties } from '../utils'

export interface MessageUpdate extends Update {
  type: 'Message'
  messageId: string
  sentAt: string

  author: Peer
  dialog: Peer

  content: string

  forwardMetadata?: {
    sender: Peer
  }

  media?: MediaPayload[]

  likeCount?: number
  repostCount?: number
  viewCount?: number

  channelPostAuthor?: Peer

  replyToMessageId?: string
}

export interface MessageForwardMetadata {
  sender: Peer
}

export interface MessageEditedUpdate extends Update {
  type: 'MessageEdited'
  messageId: string
  author: Peer
  dialog: Peer
  content: string
}

export type MessageContextPayload = MessageUpdate | MessageEditedUpdate
export type MessageContextType = MessageContextPayload['type']

export class MessageContext extends Context<MessageContextPayload, MessageContextType> {
  public media: Media[]

  public constructor (options: ContextOptions<MessageContextPayload, MessageContextType>) {
    super(options)

    this.media = 'media' in this.payload
      ? this.payload.media!.map(mediaPayload => Media.fromObject(mediaPayload, this.aitu))
      : []
  }

  public get id (): string {
    return this.payload.messageId
  }

  /** Alias for context.content */
  public get text (): string {
    return this.content
  }

  public get sender (): Peer {
    return this.payload.author
  }

  public get chat (): Peer {
    return this.payload.dialog
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

  public get sentAt (): Date | undefined {
    return 'sentAt' in this.payload ? new Date(this.payload.sentAt) : undefined
  }

  public get content (): string {
    return this.payload.content
  }

  public get hasText (): boolean {
    return this.content.length > 0
  }

  public get forwardMetadata (): MessageForwardMetadata | undefined {
    return 'forwardMetadata' in this.payload ? this.payload.forwardMetadata : undefined
  }

  public get isForward (): boolean {
    return this.forwardMetadata !== undefined
  }

  public get isCommand (): boolean {
    return this.text.startsWith('/')
  }

  public get replyMessageId (): string | undefined {
    return 'replyToMessageId' in this.payload ? this.payload.replyToMessageId : undefined
  }

  public get channelPostAuthor (): Peer | undefined {
    return 'channelPostAuthor' in this.payload ? this.payload.channelPostAuthor : undefined
  }

  // TODO: add more getters (likeCount, repostCount, viewCount, channelPostAuthor)

  public hasMedia (type?: MediaType): boolean {
    if (type) {
      return this.media.some(media => media.type === type)
    }

    return this.media.length > 0
  }

  public getMedia(type: 'Image'): ImageMedia[]

  public getMedia(type: 'Video'): VideoMedia[]

  public getMedia(type: 'Document'): DocumentMedia[]

  public getMedia(type: 'Audio'): AudioMedia[]

  public getMedia(
    type: 'RegisteredContact'
  ): ContactMedia<RegisteredContactPayload, 'RegisteredContact'>[]

  public getMedia(
    type: 'UnregisteredContact'
  ): ContactMedia<UnregisteredContactPayload, 'UnregisteredContact'>[]

  public getMedia (type?: MediaType): Media[] {
    if (!type) return this.media

    return this.media.filter(media => media.type === type)
  }

  public async send (
    content: string | SendMessageParams,
    params?: Partial<SendMessageParams>
  ): Promise<{}> {
    const options: SendMessageParams = {
      recipient: this.payload.dialog,

      ...(
        typeof content === 'string'
          ? { content, ...params }
          : content
      )
    }

    return this.aitu.api.SendMessage(options)
  }

  public async reply (
    content: string | SendMessageParams,
    params?: Partial<SendMessageParams>
  ): Promise<{}> {
    return this.send({
      replyToMessageId: !this.isChannel ? this.id : undefined,
      recipient: this.payload.dialog,

      ...(
        typeof content === 'string'
          ? { content, ...params }
          : content
      )
    })
  }

  public async sendForm (formMessage: FormMessage): Promise<{}> {
    return this.aitu.api.SendUiState({
      uiState: { formMessage },
      recipient: this.chat
    })
  }

  public async sendQuickButtons (
    quickButtonCommands: QuickButtonCommand[] | KeyboardBuilder
  ): Promise<{}> {
    return this.aitu.api.SendUiState({
      uiState: { quickButtonCommands },
      recipient: this.chat
    })
  }

  public async sendContainerMessage (content: ContainerMessage): Promise<{}> {
    return this.aitu.api.SendContainerMessage({ content, recipient: this.chat })
  }

  public serialize (): Record<string, unknown> {
    return pickProperties(this, [
      'id',
      'text',
      'sender',
      'chat',
      'sentAt',
      'media',
      'forwardMetadata',
      'replyMessageId',
      'channelPostAuthor'
    ])
  }
}
