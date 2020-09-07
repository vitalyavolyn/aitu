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
  setWebhookParams
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

  // TODO: replace empty objects with interfaces?
  getMe: {}
  getChannelInfo: getChannelInfoParams
  getChannelAdmins: getChannelAdminsParams
  getWebhookInfo: {}
  setWebhook: setWebhookParams
  deleteWebhook: {}
}

export type ApiRequestParams<C extends ApiMethod> = ApiRequestParamsMap[C]
