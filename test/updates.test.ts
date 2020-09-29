import { Aitu, Context } from '../src'
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
})
