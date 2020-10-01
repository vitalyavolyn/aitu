import { ChannelPeer } from '../../interfaces'

export interface getChannelInfoParams {
  channelId: string
}

export interface getChannelInfoResponse {
  channel: ChannelPeer
}

/** Returns channel information */
export type getChannelInfo = (params: getChannelInfoParams) => Promise<getChannelInfoResponse>
