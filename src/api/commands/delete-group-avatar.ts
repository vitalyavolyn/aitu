export interface DeleteGroupAvatarParams {
  /** Group UUID */
  groupId: string
}

export type DeleteGroupAvatar = (params: DeleteGroupAvatarParams) => Promise<{}>
