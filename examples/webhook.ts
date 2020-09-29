import { Aitu } from '../src'

const aitu = new Aitu({ token: process.env.TOKEN! })

aitu.updates.on('Message', (ctx) => {
  ctx.reply('hi!')
})

aitu.updates.startWebhook({
  path: '/secret-webhook-path',
  port: 8080
})

// assuming https://example.kz is proxied to localhost:8080
// NOTE: protocol is required, only https is allowed
aitu.api.setWebhook({ url: 'https://example.kz/secret-webhook-path' })
