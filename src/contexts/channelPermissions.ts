import { Context } from './context'
import {
  ChannelPermissionsGrantedUpdate,
  ChannelPermissionsRevokedUpdate,
  Peer,
  ChannelPeer
} from '../interfaces'
import { ChannelPermission } from '../types'
import { SendMessageParams } from '../api'
import { pickProperties } from '../utils'

export type ChannelPermissionsContextPayload =
ChannelPermissionsGrantedUpdate |
ChannelPermissionsRevokedUpdate

export type ChannelPermissionsContextType = ChannelPermissionsContextPayload['type']

export class ChannelPermissionsContext extends Context<
ChannelPermissionsContextPayload, ChannelPermissionsContextType
> {
  public get channel (): Peer {
    return 'channel' in this.payload
      ? this.payload.channel
      : { id: this.payload.channelId, type: 'CHANNEL' }
  }

  public get permissions (): ChannelPermission[] {
    return 'permissions' in this.payload ? this.payload.permissions : []
  }

  public hasPermission (permission: ChannelPermission): boolean {
    return this.permissions.includes(permission)
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
      'channel',
      'permissions'
    ])
  }
}
