import { Agent } from 'https'
import { UpdateType, PeerType, ChannelPermission, ApiResponse, ApiMethod } from './types'
import { ApiRequestParams, ApiMethods } from './api'
import { KeyboardBuilder } from './structures'

export interface AituOptions {
  token: string
  agent?: Agent
  apiBaseUrl?: string
  apiTimeout?: number
  apiHeaders?: Record<string, string>
  pollingRetryLimit?: number
  pollingTimeout?: number
}

export interface Peer {
  id: string
  type: PeerType
}

export interface UserPeer extends Peer {
  type: 'USER'
  username?: string
  firstName?: string
  lastName?: string
}

export interface ServicePeer extends Peer {
  type: 'BOT'
  name?: string
}

export interface GroupPeer extends Peer {
  type: 'GROUP'
  name?: string
}

export interface ChannelPeer extends Peer {
  type: 'CHANNEL'
  name?: string
  username?: string
}

// TODO: can bot upload gifs/send music?
export interface InputMedia {
  fileId: string
  name: string
  mediaType: 'IMAGE' | 'VIDEO' | 'AUDIO' | 'DOCUMENT'
}

export interface BaseFileMedia {
  type: 'Image' | 'Video' | 'Audio' | 'Document' | 'Gif' | 'Music'
  fileId: string
  mimeType: string
  name: string
  size: number
}

export interface Image extends BaseFileMedia {
  type: 'Image'
  width: number
  height: number
}

// Gif, Music source https://github.com/btsdigital/bot-api-contract/commit/d07ab7c635c60cdf489c1431b75e2dfd3bd8d20c
export interface Gif extends BaseFileMedia {
  type: 'Gif'
  width: number
  height: number
  duration: number
}

export interface Music extends BaseFileMedia {
  type: 'Music'
  duration: number
}

export interface Video extends BaseFileMedia {
  type: 'Video'
  width: number
  height: number
  duration: number
}

export interface Audio extends BaseFileMedia {
  type: 'Audio'
}

export interface Document extends BaseFileMedia {
  type: 'Document'
}

export interface RegisteredContact {
  type: 'RegisteredContact'
  user: User
}

export interface UnregisteredContact {
  type: 'UnregisteredContact'
  firstName?: string
  lastName?: string
  phoneNumber?: string
}

export interface Avatar {
  full: Image
  small: Image
}

export interface User extends UnregisteredContact {
  userName: string
  avatar: Avatar
}

export type ContactMediaPayload = RegisteredContact | UnregisteredContact

export type ContactMediaType = ContactMediaPayload['type']

export type MediaPayload =
Image | Video | Audio | Document |
Gif | Music | RegisteredContact | UnregisteredContact

export type MediaType = MediaPayload['type']

export interface Update {
  updateId: string
  type: UpdateType
}

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

export interface MessageEditedUpdate extends Update {
  type: 'MessageEdited'
  messageId: string
  author: Peer
  dialog: Peer
  content: string
}

interface GroupStateUpdate extends Update {
  /** Group UUID */
  groupId: string
}

interface ChannelStateUpdate extends Update {
  /** Channel UUID */
  channelId: string
}

export interface InvitedToGroupUpdate extends GroupStateUpdate {
  type: 'InvitedToGroup'
}

export interface KickedFromGroupUpdate extends GroupStateUpdate {
  type: 'KickedFromGroup'
}

export interface InvitedToChannelUpdate extends ChannelStateUpdate {
  type: 'InvitedToChannel'
}

export interface KickedFromChannelUpdate extends ChannelStateUpdate {
  type: 'KickedFromChannel'
}

interface ChannelAdminUpdate extends ChannelStateUpdate {
  admin: Peer
}

export interface ChannelAdminDeletedUpdate extends ChannelAdminUpdate {
  type: 'ChannelAdminDeleted'
}

export interface ChannelAdminAddedUpdate extends ChannelAdminUpdate {
  type: 'ChannelAdminAdded'
}

export interface NewChannelSubscriberUpdate extends ChannelStateUpdate {
  type: 'NewChannelSubscriber'
  peer: Peer
}

export interface ChannelPermissionsGrantedUpdate extends Update {
  type: 'ChannelPermissionsGranted'
  channel: Peer & { name: string }
  permissions: ChannelPermission[]
}

export interface ChannelPermissionsRevokedUpdate extends Update {
  type: 'ChannelPermissionsRevoked'
  channelId: string
}

export interface InlineCommandSelectedUpdate extends Update {
  type: 'InlineCommandSelected'
  dialog: Peer
  sender: Peer
  metadata: string
  content: string
  messageId: string
}

export interface MessageIdAssignedUpdate extends Update {
  type: 'MessageIdAssigned'
  id: string
  localId: string
  dialog: Peer
}

export interface QuickButtonSelectedUpdate extends Update {
  type: 'QuickButtonSelected'
  dialog: Peer
  sender: Peer
  metadata: string
}

export interface InlineCommand {
  /** Button caption. Max length - 32, recommended - 20 */
  caption: string
  /** JSON or any string to be returned in InlineCommandSelected update */
  metadata: string
}

export interface QuickButtonCommand {
  /** Button caption. Max length - 32, recommended - 20 */
  caption: string
  /**
   * JSON or any string to be returned to a service as a parameter in
   * update QuickButtonSelected for processing and/or data used by client
   * to perform specific action
   *
   * More info: https://btsdigital.github.io/bot-api-contract/quickbuttoncommand.html
   */
  metadata: string
  action: 'QUICK_REQUEST' | 'QUICK_FORM_ACTION'
}

export interface ReplyCommand {
  /** Button caption. Max length - 32, recommended - 20 */
  caption: string
}

export interface UiState {
  canWriteText?: boolean
  showCameraButton?: boolean
  showShareContactButton?: boolean
  showRecordAudioButton?: boolean
  showGalleryButton?: boolean
  showSpeechToTextButton?: boolean
  replyKeyboard?: ReplyCommand[] | KeyboardBuilder
  quickButtonCommands?: QuickButtonCommand[] | KeyboardBuilder
  formMessage?: any // TODO
}

export interface ApiObject extends ApiMethods {
  <T extends ApiMethod>(method: T, params: ApiRequestParams<T>): ApiResponse
}
