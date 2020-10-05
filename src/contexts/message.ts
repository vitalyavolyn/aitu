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

export interface UserPeer extends Peer {
  type: 'USER'
  firstName: string
  username: string
}

export interface MessageUpdate extends Update {
  type: 'Message'
  messageId: string
  sentAt: string

  author: UserPeer
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

export class MessageContext extends Context<MessageContextPayload> {
  /** Array of media attachments */
  public media: Media[]

  public constructor (options: ContextOptions<MessageContextPayload>) {
    super(options)

    this.media = 'media' in this.payload
      ? this.payload.media!.map((mediaPayload) => Media.fromObject(mediaPayload, this.aitu))
      : []
  }

  /** Message ID */
  public get id (): string {
    return this.payload.messageId
  }

  /** Message text, alias for context.content */
  public get text (): string {
    return this.content
  }

  /** Info about the user (bot) who sent the message, alias for context.author */
  public get sender (): Peer | UserPeer {
    return this.payload.author
  }

  /** Info about the user (bot) who sent the message */
  public get author (): Peer | UserPeer {
    return this.payload.author
  }

  /** Info about dialog containing the message */
  public get dialog (): Peer {
    return this.payload.dialog
  }

  /** Info about dialog containing the message, alias of ctx.dialog */
  public get chat (): Peer {
    return this.dialog
  }

  /** Dialog type */
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

  /** Message text */
  public get content (): string {
    return this.payload.content
  }

  public get hasText (): boolean {
    return this.content.length > 0
  }

  /** Info about original sender if message is forwarded */
  public get forwardMetadata (): MessageForwardMetadata | undefined {
    return 'forwardMetadata' in this.payload ? this.payload.forwardMetadata : undefined
  }

  public get isForward (): boolean {
    return this.forwardMetadata !== undefined
  }

  /** Does the message start with '/'? */
  public get isCommand (): boolean {
    return this.text.startsWith('/')
  }

  public get replyMessageId (): string | undefined {
    return 'replyToMessageId' in this.payload ? this.payload.replyToMessageId : undefined
  }

  public get channelPostAuthor (): Peer | undefined {
    return 'channelPostAuthor' in this.payload ? this.payload.channelPostAuthor : undefined
  }

  public hasMedia (type?: MediaType): boolean {
    if (type) {
      return this.media.some((media) => media.type === type)
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

    return this.media.filter((media) => media.type === type)
  }

  /**
   * Send a message to the dialog
   *
   * @example
   * ctx.send('Message text')
   * ctx.send('Reply', { replyToMessageId: ctx.id }) // you can use ctx.reply()
   * ctx.send({ content: 'Parameters as one argument' })
   */
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

  /**
   * Reply to the message
   *
   * @example
   * ctx.reply('Message text')
   * ctx.reply('I have a button!', {
   *   inlineCommandRows: Keyboard.builder()
   *     .inlineCommand({ caption: 'Inline btn', metadata: '' })
   * })
   * ctx.reply({ content: 'Parameters as one argument' })
   */
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

  /** Send a container message */
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
