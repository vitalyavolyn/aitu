export interface ChangeGroupDescriptionParams {
  /** Group UUID */
  groupId: string
  /** New group description */
  description: string
}

export type ChangeGroupDescription = (params: ChangeGroupDescriptionParams) => Promise<{}>
