import { Aitu, Keyboard } from '../src'

const aitu = new Aitu({ token: process.env.TOKEN! })

aitu.updates.on('Message', (ctx) => {
  ctx.reply('hi!', {
    inlineCommandRows: Keyboard.builder().inlineCommand({ caption: 'Inline btn', metadata: '' })
  })
})

aitu.updates.startPolling().catch(console.error)
