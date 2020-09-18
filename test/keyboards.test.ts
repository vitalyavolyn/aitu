import { Keyboard, KeyboardBuilder, ReplyCommand, QuickButtonCommand, InlineCommand } from '../src'

describe('Keyboards', () => {
  describe('KeyboardBuilder', () => {
    it('throws a TypeError when mixing buttons of different types', () => {
      const builder = new KeyboardBuilder()
      builder.replyCommand({ caption: 'reply button' })

      expect(() => {
        builder.inlineCommand({ caption: 'inline command', metadata: '' })
      }).toThrow(TypeError)
    })

    it('ignores #row() when keyboard type is not inline', () => {
      const quickButtonBuilder = new KeyboardBuilder()
        .quickButtonCommand({ action: 'QUICK_REQUEST', caption: 'quick btn', metadata: '' })
        .row()
        .quickButtonCommand({ action: 'QUICK_REQUEST', caption: 'quick btn 2', metadata: '' })
        .quickButtonCommand({ action: 'QUICK_REQUEST', caption: 'quick btn 3', metadata: '' })

      const replyCommandBuilder = new KeyboardBuilder()
        .replyCommand({ caption: 'reply command' })
        .row()
        .replyCommand({ caption: 'reply command 2' })
        .replyCommand({ caption: 'reply command 3' })

      expect(quickButtonBuilder.toJSON().length).toBe(3)
      expect(quickButtonBuilder.toJSON()[0]).not.toBeInstanceOf(Array)

      expect(replyCommandBuilder.toJSON().length).toBe(3)
      expect(replyCommandBuilder.toJSON()[0]).not.toBeInstanceOf(Array)
    })

    it('throws a RangeError when adding too much inline rows', () => {
      const builder = new KeyboardBuilder()

      // max row count = 8
      for (let i = 0; i < 8; i++) {
        builder.inlineCommand({ caption: 'row' + i, metadata: '' })
        builder.row()
      }

      expect(() => {
        builder.inlineCommand({ caption: 'row 9', metadata: '' })
        builder.row()
      }).toThrow(RangeError)
    })

    it('throws a RangeError when adding too much inline columns', () => {
      const builder = new KeyboardBuilder()

      // max column count = 8
      for (let i = 0; i < 8; i++) {
        builder.inlineCommand({ caption: i.toString(), metadata: '' })
      }

      expect(() => {
        builder.inlineCommand({ caption: '9', metadata: '' })
      }).toThrow(RangeError)
    })

    it('throws a RangeError when adding too much quick buttons', () => {
      const builder = new KeyboardBuilder()

      // max count of buttons = 25
      for (let i = 0; i < 25; i++) {
        builder.quickButtonCommand({ caption: 'btn' + i, metadata: '', action: 'QUICK_REQUEST' })
      }

      expect(() => {
        builder.quickButtonCommand({ caption: 'btn 26', metadata: '', action: 'QUICK_REQUEST' })
      }).toThrow(RangeError)
    })

    it('throws when button caption is too long', () => {
      const inlineBuilder = new KeyboardBuilder()
      const quickButtonBuilder = new KeyboardBuilder()
      const replyBuilder = new KeyboardBuilder()
      const caption = 'a'.repeat(33)

      expect(() => {
        inlineBuilder.inlineCommand({ caption, metadata: '' })
      }).toThrow(RangeError)

      expect(() => {
        quickButtonBuilder.quickButtonCommand({ caption, metadata: '', action: 'QUICK_REQUEST' })
      }).toThrow(RangeError)

      expect(() => {
        replyBuilder.replyCommand({ caption })
      }).toThrow(RangeError)
    })

    it('returns a valid ReplyCommand keyboard', () => {
      const builder = new KeyboardBuilder()
      const row: ReplyCommand[] = []

      for (let i = 0; i++; i < 100) {
        builder.replyCommand(
          i % 2 === 0 // half are objects, half are strings
            ? { caption: i.toString() }
            : i.toString()
        )
        row.push({ caption: i.toString() })
      }

      expect(builder.toJSON()).toMatchObject(row)
    })

    it('returns a valid QuickButtonCommand keyboard', () => {
      const builder = new KeyboardBuilder()

      builder
        .quickButtonCommand({
          action: 'QUICK_REQUEST',
          caption: '',
          metadata: ''
        })
        .quickButtonCommand({
          action: 'QUICK_FORM_ACTION',
          caption: '',
          metadata: { action: 'submit_form' } // will be serialized to JSON
        })
        .quickButtonCommand({
          action: 'QUICK_FORM_ACTION',
          caption: '',
          metadata: '{"action":"submit_form"}'
        })

      const expected: QuickButtonCommand[] = [
        {
          action: 'QUICK_REQUEST',
          caption: '',
          metadata: ''
        },
        {
          action: 'QUICK_FORM_ACTION',
          caption: '',
          metadata: '{"action":"submit_form"}'
        },
        {
          action: 'QUICK_FORM_ACTION',
          caption: '',
          metadata: '{"action":"submit_form"}'
        }
      ]

      expect(builder.toJSON()).toMatchObject(expected)
    })

    it('returns a valid InlineCommand keyboard', () => {
      const builder = new KeyboardBuilder()
      const expected: InlineCommand[][] = [[]]

      for (let i = 0; i < 8; i++) {
        for (let i = 0; i < 8; i++) {
          builder.inlineCommand({ caption: '', metadata: '' })
          expected[expected.length - 1].push({ caption: '', metadata: '' })
        }

        builder.row()
        expected.push([])
      }

      expected.pop() // remove empy array at the end
      expect(builder.toJSON()).toMatchObject(expected)
    })

    describe('#clone()', () => {
      it('returns the same keyboard', () => {
        const builder = new KeyboardBuilder()
          .replyCommand('1')

        const clone = builder.clone()

        expect(clone.toJSON()).toMatchObject(builder.toJSON())
      })
    })
  })

  describe('Keyboard', () => {
    describe('.keyboard()', () => {
      it('returns a valid ReplyCommand keyboard', () => {
        const keyboard = Keyboard.keyboard([
          Keyboard.replyCommand('string caption'),
          Keyboard.replyCommand({ caption: 'obj with caption' })
        ])

        const expected: ReplyCommand[] = [
          { caption: 'string caption' },
          { caption: 'obj with caption' }
        ]

        expect(keyboard.toJSON()).toMatchObject(expected)
      })

      it('returns a valid QuickButtonCommand keyboard', () => {
        const keyboard = Keyboard.keyboard([
          Keyboard.quickButtonCommand({
            action: 'QUICK_REQUEST',
            caption: '',
            metadata: ''
          }),
          Keyboard.quickButtonCommand({
            action: 'QUICK_FORM_ACTION',
            caption: '',
            metadata: { action: 'submit_form' } // will be serialized to JSON
          }),
          Keyboard.quickButtonCommand({
            action: 'QUICK_FORM_ACTION',
            caption: '',
            metadata: '{"action":"submit_form"}'
          })
        ])

        const expected: QuickButtonCommand[] = [
          {
            action: 'QUICK_REQUEST',
            caption: '',
            metadata: ''
          },
          {
            action: 'QUICK_FORM_ACTION',
            caption: '',
            metadata: '{"action":"submit_form"}'
          },
          {
            action: 'QUICK_FORM_ACTION',
            caption: '',
            metadata: '{"action":"submit_form"}'
          }
        ]

        expect(keyboard.toJSON()).toMatchObject(expected)
      })

      it('returns a valid InlineCommand keyboard', () => {
        const keyboard = Keyboard.keyboard([
          [
            Keyboard.inlineCommand({
              caption: '',
              metadata: ''
            }),
            Keyboard.inlineCommand({
              caption: '',
              metadata: ''
            })
          ],
          [
            Keyboard.inlineCommand({
              caption: '',
              metadata: ''
            })
          ],
          Keyboard.inlineCommand({
            caption: '',
            metadata: ''
          })
        ])

        const expected: InlineCommand[][] = [
          [
            {
              caption: '',
              metadata: ''
            },
            {
              caption: '',
              metadata: ''
            }
          ],
          [
            {
              caption: '',
              metadata: ''
            }
          ],
          [
            {
              caption: '',
              metadata: ''
            }
          ]
        ]

        expect(keyboard.toJSON()).toMatchObject(expected)
      })
    })
  })
})
