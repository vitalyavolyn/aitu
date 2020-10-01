import { Peer } from '../../interfaces'

export interface DeleteMessageParams {
  /** Dialog containing the message to delete */
  dialog: Peer
  /** UUID of the message to delete */
  messageId: string
}

export type DeleteMessage = (params: DeleteMessageParams) => Promise<{}>
