import { Aitu, Content, Form } from '../../src'

const aitu = new Aitu({ token: process.env.TOKEN! })

const buttonExample: Content[] = [
  {
    type: 'text',
    title: 'Button',
    options: { text_size: 'H1' }
  },
  {
    type: 'button',
    title: 'Open google.com',
    id: 'btn1',
    form_action: { action: 'open_url', data_template: 'https://google.com' },
    options: { background_color: 'filled_dark' }
  }
]

aitu.updates.on('Message', (ctx) => {
  ctx.sendForm(new Form({
    id: 'form1',
    content: buttonExample,
    header: { title: 'Header', type: 'title', options: { closeable: true } }
  }))
})

aitu.updates.startPolling().catch(console.error)
