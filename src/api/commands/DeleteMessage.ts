import { Peer } from '../../interfaces'

export interface DeleteMessageParams {
  /** Peer message to delete was sent to */
  dialog: Peer
  /** UUID of the message to delete */
  messageId: string
}

export type DeleteMessage = (params: DeleteMessageParams) => Promise<{}>
