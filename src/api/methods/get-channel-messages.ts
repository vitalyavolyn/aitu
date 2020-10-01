import { MessageUpdate } from '../../contexts'

interface getChannelMessagesParamsSimple {
  channelId: string
  direction: 'EARLY' | 'LATER'
}

interface getChannelMessagesParamsAround {
  channelId: string
  direction: 'AROUND'
  messageId: string
}

export type getChannelMessagesParams =
  getChannelMessagesParamsAround | getChannelMessagesParamsSimple

export type getChannelMessagesResponse = MessageUpdate[]

/**
 * Returns the channel's messages
 *
 * Directions:
 * - EARLY: sort by date, asc.
 * - LATER: sort by date, desc.
 * - AROUND: TODO.
 */
export interface getChannelMessages {
  (params: getChannelMessagesParamsSimple): Promise<getChannelMessagesResponse>
  (params: getChannelMessagesParamsAround): Promise<getChannelMessagesResponse>
}
