export interface ChangeGroupDescriptionParams {
  /** Group UUID */
  groupId: string
  /** New group description */
  description: string
}

/** Changes group description if bot has permission to do so */
export type ChangeGroupDescription = (params: ChangeGroupDescriptionParams) => Promise<{}>
