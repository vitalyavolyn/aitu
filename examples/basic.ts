import { Aitu } from '../src'

const aitu = new Aitu({ token: process.env.TOKEN! })

aitu.updates.on('Message', (ctx) => {
  ctx.reply('hi!')
})

aitu.updates.startPolling().catch(console.error)
