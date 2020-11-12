import { Aitu, Keyboard } from '../src'

const aitu = new Aitu({ token: process.env.TOKEN! })

aitu.updates.on('Message', (ctx) => {
  ctx.reply('Choose a pill', {
    inlineCommandRows: Keyboard.keyboard([
      Keyboard.inlineCommand({ caption: '🔴', metadata: 'red' }),
      Keyboard.inlineCommand({ caption: '🔵', metadata: 'blue' })
    ])
  })
})

aitu.updates.on('InlineCommandSelected', (ctx) => {
  const { metadata } = ctx

  ctx.send(
    metadata === 'red' ? '🐰' : 'Good morning, Mr. Anderson.'
  )
})

aitu.updates.startPolling().catch(console.error)
