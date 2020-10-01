import { Peer } from '../../interfaces'

export interface ForwardMessageParams {
  /**
   * Message ID generated by bot, can be any string (max length - 255).
   * Bot will receive MessageIdAssigned update with localId - messageId match
   */
  localId?: string
  fromDialog: Peer
  toDialog: Peer
  /** UUID of the message to forward */
  messageId: string
}

/** Forwards a message from one chat to another */
export type ForwardMessage = (params: ForwardMessageParams) => Promise<{}>
