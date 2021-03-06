import * as api from '.'
import { ApiMethod } from '../types'

export interface ApiMethods {
  SendMessage: api.SendMessage
  ForwardMessage: api.ForwardMessage
  EditMessage: api.EditMessage
  SendUiState: api.SendUiState
  DeleteMessage: api.DeleteMessage
  KickFromGroup: api.KickFromGroup
  ChangeGroupAvatar: api.ChangeGroupAvatar
  ChangeGroupDescription: api.ChangeGroupDescription
  ChangeGroupTitle: api.ChangeGroupTitle
  DeleteGroupAvatar: api.DeleteGroupAvatar
  SendContainerMessage: api.SendContainerMessage
  EditContainerMessage: api.EditContainerMessage

  getMe: api.getMe
  getChannelInfo: api.getChannelInfo
  getChannelAdmins: api.getChannelAdmins
  getChannelMessages: api.getChannelMessages
  getWebhookInfo: api.getWebhookInfo
  setWebhook: api.setWebhook
  deleteWebhook: api.deleteWebhook
  getAvatar: api.getAvatar

  uploadFiles: api.uploadFiles
}

export type ApiResponse<M extends ApiMethod> = ReturnType<ApiMethods[M]>
export type ApiRequestParams<M extends ApiMethod> = Parameters<ApiMethods[M]>[0]
