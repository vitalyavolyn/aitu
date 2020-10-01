import { Peer } from '../../interfaces'

export interface getChannelAdminsParams {
  channelId: string
}

export interface getChannelAdminsResponse {
  admins: Peer[]
}

/** Returns channel admins */
export type getChannelAdmins = (params: getChannelAdminsParams) => Promise<getChannelAdminsResponse>
