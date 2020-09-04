export interface ChangeGroupAvatarParams {
  /** Group UUID */
  groupId: string
  /** File ID which has already been uploaded as an avatar (uploadAvatar method) */
  fileId: string
}

export type ChangeGroupAvatar = (params: ChangeGroupAvatarParams) => Promise<{}>
