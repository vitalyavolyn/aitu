export interface ChangeGroupTitleParams {
  /** Group UUID */
  groupId: string
  /** New group title */
  title: string
}

/** Changes group title if bot has permission to do so */
export type ChangeGroupTitle = (params: ChangeGroupTitleParams) => Promise<{}>
