import { Aitu, Form, Keyboard } from '../src'

const aitu = new Aitu({
  token: process.env.TOKEN!
})

const qButtons = Keyboard.builder()
  .quickButtonCommand({
    action: 'QUICK_REQUEST',
    caption: 'Action',
    metadata: 'action'
  })
  .quickButtonCommand({
    action: 'QUICK_REQUEST',
    caption: 'Form',
    metadata: 'form'
  })
  .quickButtonCommand({
    action: 'QUICK_FORM_ACTION',
    caption: 'Call',
    metadata: {
      action: 'redirect_call',
      data_template: '+78005553535'
    }
  })
  .quickButtonCommand({
    action: 'QUICK_FORM_ACTION',
    caption: 'Send my phone',
    metadata: {
      action: 'send_private_data',
      data_template: 'phone'
    }
  })
  .quickButtonCommand({
    action: 'QUICK_FORM_ACTION',
    caption: 'Send my phone (with metadata)',
    metadata: {
      action: 'send_private_data',
      data_template: 'phone this is metadata'
    }
  })

const uiState = {
  canWriteText: false,
  showCameraButton: false,
  showGalleryButton: false,
  showRecordAudioButton: false,
  showShareContactButton: false,
  quickButtonCommands: qButtons
}

const { updates } = aitu

updates.on('Message', (ctx) => {
  ctx.send('QuickButtons demo', { uiState })
})

updates.on('QuickButtonSelected', (ctx) => {
  if (ctx.metadata === 'action') {
    ctx.send('Selected button: action', { uiState })
  }

  if (ctx.metadata === 'form') {
    ctx.sendForm(new Form({
      id: 'form',
      content: [
        { type: 'input', id: 'input' }
      ],
      header: { title: 'A form!', type: 'title', options: { closeable: true } },
      bottom_bar: {
        form_action: { action: 'submit_form' },
        id: 'bottom_bar',
        title: 'Submit'
      },
      options: { fullscreen: true }
    }))
  }
})

updates.on('FormSubmitted', (ctx) => {
  if (!ctx.formResults.input) return

  ctx.send(`Result: ${ctx.formResults.input}`, { uiState })
})

updates.startPolling()
