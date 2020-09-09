import { Aitu, Context, FormContext } from '../src'

const aitu = new Aitu({ token: '' })

describe('Contexts', () => {
  describe('Context', () => {
    describe('#is', () => {
      const context = new Context({ aitu, payload: { type: 'Message', updateId: '' } })

      it('returns true when any of the required types are present', () => {
        expect(context.is('Message')).toBe(true)
        expect(context.is(['Message'])).toBe(true)
        expect(context.is(['Message', 'FormSubmitted'])).toBe(true)
      })

      it('returns false when none of the required types are present', () => {
        expect(context.is('FormSubmitted')).toBe(false)
        expect(context.is(['FormSubmitted'])).toBe(false)
      })
    })
  })

  describe('FormContext', () => {
    const context = new FormContext({
      aitu,
      payload: {
        updateId: '',
        formId: 'formId',
        dialog: { id: '', type: 'USER' },
        sender: { id: '', type: 'USER' },
        metadata: '',
        additionalMetadata: `{
          "form":{
            "content": [
              {"id":"input","type":"input","value":"Text!"},
              {"id":"emptyRadiogroup","type":"radiogroup"},
              {"id":"radiogroup","type":"radiogroup","value":"abc"}
            ],
            "id":"formId"
          }
        }`,
        type: 'FormSubmitted'
      }
    })

    describe('#formResults', () => {
      it('is correct', () => {
        expect(context.formResults).toMatchObject({
          input: 'Text!',
          emptyRadiogroup: undefined,
          radiogroup: 'abc'
        })
      })
    })
  })
})
