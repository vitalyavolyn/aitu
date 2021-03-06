import { Aitu } from '../src'

const aitu = new Aitu({ token: process.env.TOKEN! })

aitu.updates.on('Message', (ctx) => {
  const { content, media } = ctx

  ctx.send({ content, mediaList: media.filter((e) => e.isSendable) })
})

aitu.updates.startPolling().catch(console.error)
