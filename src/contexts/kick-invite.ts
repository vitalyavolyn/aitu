import { Update, Peer, ChannelPeer } from '../interfaces'
import { Context } from './context'
import { PeerType } from '../types'
import { SendMessageParams } from '../api'
import { pickProperties } from '../utils'

interface GroupStateUpdate extends Update {
  /** Group UUID */
  groupId: string
}

interface ChannelStateUpdate extends Update {
  /** Channel UUID */
  channelId: string
}

export interface InvitedToGroupUpdate extends GroupStateUpdate {
  type: 'InvitedToGroup'
}

export interface KickedFromGroupUpdate extends GroupStateUpdate {
  type: 'KickedFromGroup'
}

export interface InvitedToChannelUpdate extends ChannelStateUpdate {
  type: 'InvitedToChannel'
}

export interface KickedFromChannelUpdate extends ChannelStateUpdate {
  type: 'KickedFromChannel'
}

export type KickInviteContextPayload =
InvitedToGroupUpdate |
KickedFromGroupUpdate |
InvitedToChannelUpdate |
KickedFromChannelUpdate

export type KickInviteContextType = KickInviteContextPayload['type']

export class KickInviteContext extends Context<KickInviteContextPayload> {
  public get isInvited (): boolean {
    return ['InvitedToGroupUpdate', 'InvitedToChannelUpdate'].includes(this.type)
  }

  public get isKicked (): boolean {
    return !this.isInvited
  }

  /** Group UUID (if event is linked to a group) */
  public get groupId (): string | undefined {
    return 'groupId' in this.payload ? this.payload.groupId : undefined
  }

  /** Channel UUID (if event is linked to a channel) */
  public get channelId (): string | undefined {
    return 'channelId' in this.payload ? this.payload.channelId : undefined
  }

  public get isGroup (): boolean {
    return 'groupId' in this.payload
  }

  public get isChannel (): boolean {
    return !this.isGroup
  }

  public get chatType (): PeerType {
    return this.isGroup ? 'GROUP' : 'CHANNEL'
  }

  public get chat (): Peer {
    const id = this.channelId || this.groupId

    return { id: id!, type: this.chatType }
  }

  /** Get information about the channel */
  public getChannelInfo (): Promise<ChannelPeer> {
    if (!this.isChannel) {
      throw new TypeError(`Chat is a ${this.chatType}, not a CHANNEL`)
    }

    const channelId = this.chat.id

    return this.aitu.api.getChannelInfo({ channelId }).then((response) => response.channel)
  }

  /** Send a message to the channel or group */
  public async send (
    content: string | SendMessageParams,
    params?: Partial<SendMessageParams>
  ): Promise<{}> {
    const options: SendMessageParams = {
      recipient: this.chat,

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
      'chat'
    ])
  }
}
