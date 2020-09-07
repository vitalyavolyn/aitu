import { Avatar } from '../../structures'

export interface getAvatarParams {
  userId: string
}

export interface getAvatarResponse {
  avatar: Avatar
}

export type getAvatar = (params: getAvatarParams) => Promise<getAvatarResponse>
