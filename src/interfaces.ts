import { Agent } from 'https'
import { UpdateType, PeerType, ApiResponse, ApiMethod } from './types'
import { ApiRequestParams, ApiMethods } from './api'
import { KeyboardBuilder, ReplyCommand, QuickButtonCommand } from './structures'

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

export interface ChannelPeer extends Peer {
  type: 'CHANNEL'
  name?: string
  username?: string
}

export interface Update {
  updateId: string
  type: UpdateType
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
