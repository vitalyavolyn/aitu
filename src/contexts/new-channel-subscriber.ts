import { Update, Peer, ChannelPeer } from '../interfaces'
import { Context } from './context'
import { SendMessageParams } from '../api'
import { pickProperties } from '../utils'

export interface NewChannelSubscriberUpdate extends Update {
  /** Channel UUID */
  channelId: string
  type: 'NewChannelSubscriber'
  peer: Peer
}

export type NewChannelSubscriberContextPayload = NewChannelSubscriberUpdate
export type NewChannelSubscriberContextType = NewChannelSubscriberContextPayload['type']

export class NewChannelSubscriberContext extends Context<NewChannelSubscriberContextPayload> {
  public get channel (): Peer {
    return { id: this.payload.channelId, type: 'CHANNEL' }
  }

  public get user (): Peer {
    return this.payload.peer
  }

  public getChannelInfo (): Promise<ChannelPeer> {
    const channelId = this.channel.id

    return this.aitu.api.getChannelInfo({ channelId }).then((response) => response.channel)
  }

  /** Send a message to the channel */
  public async send (
    content: string | SendMessageParams,
    params?: Partial<SendMessageParams>
  ): Promise<{}> {
    const options: SendMessageParams = {
      recipient: this.channel,

      ...(
        typeof content === 'string'
          ? { content, ...params }
          : content
      )
    }

    return this.aitu.api.SendMessage(options)
  }

  public serialize (): Record<string, unknown> {
    return pickProperties(this, [
      'channel',
      'user'
    ])
  }
}
