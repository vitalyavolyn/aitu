import { Agent } from 'https'
import { UpdateType, PeerType, ApiMethod } from './types'
import { ApiRequestParams, ApiMethods, ApiResponse } from './api'
import { KeyboardBuilder, ReplyCommand, QuickButtonCommand, FormMessage } from './structures'

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

export interface UpdatesPayload {
  updates: Update[]
}

export interface UiState {
  canWriteText?: boolean
  showCameraButton?: boolean
  showShareContactButton?: boolean
  showRecordAudioButton?: boolean
  showGalleryButton?: boolean
  showSpeechToTextButton?: boolean

  /**
   * A list composed of QuickButtonCommand objects (or KeyboardBuilder with reply commands)
   */
  replyKeyboard?: ReplyCommand[] | KeyboardBuilder

  /**
   * A list composed of QuickButtonCommand objects (or KeyboardBuilder with quick buttons)
   *
   * Max length - 25
   */
  quickButtonCommands?: QuickButtonCommand[] | KeyboardBuilder
  formMessage?: FormMessage
}

export interface ApiObject extends ApiMethods {
  <T extends ApiMethod>(method: T, params?: ApiRequestParams<T>): ApiResponse<T>
}
