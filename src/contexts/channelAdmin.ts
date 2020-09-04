import { Context } from './context'
import {
  ChannelAdminAddedUpdate,
  ChannelAdminDeletedUpdate,
  Peer,
  ChannelPeer
} from '../interfaces'
import { SendMessageParams } from '../api'
import { pickProperties } from '../utils'

export type ChannelAdminContextPayload = ChannelAdminAddedUpdate | ChannelAdminDeletedUpdate
export type ChannelAdminContextType = ChannelAdminContextPayload['type']

export class ChannelAdminContext extends Context<
ChannelAdminContextPayload, ChannelAdminContextType
> {
  public get isAdded (): boolean {
    return this.type === 'ChannelAdminAdded'
  }

  public get isDeleted (): boolean {
    return !this.isAdded
  }

  public get admin (): Peer {
    return this.payload.admin
  }

  public get channel (): Peer {
    return { type: 'CHANNEL', id: this.payload.channelId }
  }

  public getChannelInfo (): Promise<ChannelPeer> {
    const channelId = this.channel.id

    return this.aitu.api.getChannelInfo({ channelId }).then(res => res.channel)
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
      'admin',
      'channel'
    ])
  }
}
