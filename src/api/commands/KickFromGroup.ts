import { Peer } from '../../interfaces'

export interface KickFromGroupParams {
  /** Group UUID */
  groupId: string
  /** Peer to be removed from group */
  peerToKick: Peer
}

export type KickFromGroup = (params: KickFromGroupParams) => Promise<{}>
