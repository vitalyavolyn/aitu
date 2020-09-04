export interface ChangeGroupTitleParams {
  /** Group UUID */
  groupId: string
  /** New group title */
  title: string
}

export type ChangeGroupTitle = (params: ChangeGroupTitleParams) => Promise<{}>
