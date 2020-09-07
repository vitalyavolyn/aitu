import {
  SendMessageParams,
  EditMessageParams,
  ForwardMessageParams,
  SendUiStateParams,
  DeleteMessageParams,
  KickFromGroupParams,
  ChangeGroupAvatarParams,
  ChangeGroupDescriptionParams,
  ChangeGroupTitleParams,
  DeleteGroupAvatarParams,
  SendContainerMessageParams,
  EditContainerMessageParams,

  getChannelInfoParams,
  getChannelAdminsParams,
  getChannelMessagesParams,
  setWebhookParams,
  getAvatarParams
} from '.'
import { ApiMethod } from '../types'

export interface ApiRequestParamsMap {
  SendMessage: SendMessageParams
  EditMessage: EditMessageParams
  ForwardMessage: ForwardMessageParams
  SendUiState: SendUiStateParams
  DeleteMessage: DeleteMessageParams
  KickFromGroup: KickFromGroupParams
  ChangeGroupAvatar: ChangeGroupAvatarParams
  ChangeGroupDescription: ChangeGroupDescriptionParams
  ChangeGroupTitle: ChangeGroupTitleParams
  DeleteGroupAvatar: DeleteGroupAvatarParams
  SendContainerMessage: SendContainerMessageParams
  EditContainerMessage: EditContainerMessageParams

  getMe: {}
  getChannelInfo: getChannelInfoParams
  getChannelAdmins: getChannelAdminsParams
  getChannelMessages: getChannelMessagesParams
  getWebhookInfo: {}
  setWebhook: setWebhookParams
  deleteWebhook: {}
  getAvatar: getAvatarParams
}

export type ApiRequestParams<C extends ApiMethod> = ApiRequestParamsMap[C]
