import { Peer } from '../../interfaces'

export interface KickFromGroupParams {
  /** Group UUID */
  groupId: string
  /** Peer to be removed from group */
  peerToKick: Peer
}

/** Removes a user from the group if bot has permission to do so */
export type KickFromGroup = (params: KickFromGroupParams) => Promise<{}>
