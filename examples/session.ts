import { Aitu, MessageContext, session } from '../src'

const aitu = new Aitu({ token: process.env.TOKEN! })

aitu.updates.use(session())

aitu.updates.on('Message', (ctx: MessageContext & { session: Record<string, number> }, next) => {
  if (ctx.text !== '/counter') return next()
  const { session } = ctx

  if (!session.counter) session.counter = 0

  session.counter++
  ctx.send(`Your count is: ${session.counter}`)
})

aitu.updates.startPolling().catch(console.error)
