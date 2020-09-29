import Koa from 'koa'
import { Aitu } from '../src'

const app = new Koa()
const aitu = new Aitu({ token: process.env.TOKEN! })

aitu.updates.on('Message', (ctx) => {
  ctx.reply('hi from koa!')
})

app.use(aitu.updates.getKoaWebhookMiddleware())
app.listen(process.env.PORT)
