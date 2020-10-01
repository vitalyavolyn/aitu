import { UpdatesPayload } from './interfaces'
import { ApiErrorParams } from './errors'

export type UpdateType =
'Message' |
'MessageEdited' |
'MessageIdAssigned' |
'QuickButtonSelected' |
'InlineCommandSelected' |
'FormSubmitted' |
'FormMessageSent' |
'FormClosed' |
'InvitedToGroup' |
'KickedFromGroup' |
'InvitedToChannel' |
'KickedFromChannel' |
'NewChannelSubscriber' |
'ChannelAdminAdded' |
'ChannelAdminDeleted' |
'ChannelPermissionsGranted' |
'ChannelPermissionsRevoked'

export type ApiCommand =
'SendMessage' |
'EditMessage' |
'DeleteMessage' |
'SendContainerMessage' |
'EditContainerMessage' |
'ForwardMessage' |
'SendUiState' |
'KickFromGroup' |
'ChangeGroupAvatar' |
'DeleteGroupAvatar' |
'ChangeGroupTitle' |
'ChangeGroupDescription'

export type ApiMethod =
ApiCommand |
'getMe' |
'getChannelInfo' |
'getChannelAdmins' |
'getChannelMessages' |
'getWebhookInfo' |
'setWebhook' |
'deleteWebhook' |
'getAvatar'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ApiResponse = any // ¯\_(ツ)_/¯

export type UpdateResponse = UpdatesPayload | ApiErrorParams

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Constructor<T = {}> = new (...args: any[]) => T

export type AllowArray<T> = T | T[]

export type PeerType = 'USER' | 'BOT' | 'CHANNEL' | 'GROUP'

export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
