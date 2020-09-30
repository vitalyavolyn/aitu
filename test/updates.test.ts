import { Aitu, Context, MessageContext, session, MessageUpdate } from '../src'
import { Peer } from '../src/interfaces'
import { UpdateType } from '../src/types'

const updateTypes: UpdateType[] = [
  'Message',
  'MessageEdited',
  'MessageIdAssigned',
  'QuickButtonSelected',
  'InlineCommandSelected',
  'FormSubmitted',
  'FormMessageSent',
  'FormClosed',
  'InvitedToGroup',
  'KickedFromGroup',
  'InvitedToChannel',
  'KickedFromChannel',
  'NewChannelSubscriber',
  'ChannelAdminAdded',
  'ChannelAdminDeleted',
  'ChannelPermissionsGranted',
  'ChannelPermissionsRevoked'
]

describe('Updates', () => {
  for (const updateType of updateTypes) {
    it('provides context for ' + updateType, (done) => {
      const aitu = new Aitu({ token: '' })

      // @ts-expect-error
      aitu.updates.on(updateType, (ctx) => {
        expect(ctx.type).toEqual(updateType)
        expect(ctx).toHaveProperty('updateId')
        expect(ctx).toBeInstanceOf(Context)
        done()
      })

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      aitu.updates.handleUpdate({ type: updateType, updateId: '' } as any)
    })
  }

  it('shares state between middlewares', (done) => {
    const aitu = new Aitu({ token: '' })

    aitu.updates.on('Message', [
      (ctx, next) => {
        ctx.state.answer = 41
        next()
      },
      (ctx, next) => {
        ctx.state.answer++
        next()
      },
      (ctx) => {
        expect(ctx.state.answer).toBe(42)
        done()
      }
    ])

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    aitu.updates.handleUpdate({ type: 'Message', updateId: '' } as any)
  })

  it('stores session state', async (done) => {
    const { updates } = new Aitu({ token: '' })
    updates.use(session())

    updates.on('Message', (ctx: MessageContext & { session: Record<string, number> }, next) => {
      if (ctx.text === 'end') return next()

      if (!ctx.session.counter) ctx.session.counter = 0
      ctx.session.counter++
    })

    updates.on('Message', (ctx: MessageContext & { session: Record<string, number> }) => {
      expect(ctx.session.counter).toEqual(2)
      done()
    })

    const user1: Peer = { type: 'USER', id: '1' }
    const user2: Peer = { type: 'USER', id: '2' }

    await updates.handleUpdate<MessageUpdate>({
      author: user1,
      content: '',
      dialog: user1,
      messageId: '',
      sentAt: '',
      type: 'Message',
      updateId: ''
    })

    await updates.handleUpdate<MessageUpdate>({
      author: user2,
      content: '',
      dialog: user2,
      messageId: '',
      sentAt: '',
      type: 'Message',
      updateId: ''
    })

    await updates.handleUpdate<MessageUpdate>({
      author: user1,
      content: '',
      dialog: user1,
      messageId: '',
      sentAt: '',
      type: 'Message',
      updateId: ''
    })

    updates.handleUpdate<MessageUpdate>({
      author: user1,
      content: 'end',
      dialog: user1,
      messageId: '',
      sentAt: '',
      type: 'Message',
      updateId: ''
    })
  })
})
