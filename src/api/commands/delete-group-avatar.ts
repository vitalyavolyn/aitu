export interface DeleteGroupAvatarParams {
  /** Group UUID */
  groupId: string
}

/** Removes group avatar if bot has permission to do so */
export type DeleteGroupAvatar = (params: DeleteGroupAvatarParams) => Promise<{}>
