const { Aitu, session, Stage, StepScene } = require('..')

const aitu = new Aitu({ token: process.env.TOKEN })

const stage = new Stage()

aitu.updates.use(session())

// this middleware adds context.scene
aitu.updates.use(stage.middleware)

// this middleware enters scenes
aitu.updates.use(stage.sceneMiddleware)

/*

  You can use more complex middlewares instead of stage.sceneMiddleware
  Example with /cancel command support:

  updates.on('Message', async (ctx, next) => {
    if (!ctx.scene.current) {
      return next()
    }

    const cancel = ctx.text === '/cancel'
    if (cancel) {
      ctx.send('OK.')
      return ctx.scene.leave({
        canceled: true
      })
    }

    return ctx.scene.reenter()
  })

*/

aitu.updates.on('Message', (ctx) => {
  if (ctx.text === '/signup') {
    return ctx.scene.enter('signup')
  }

  ctx.send('Use /signup to enter scene')
})

stage.addScenes([
  new StepScene('signup', [
    (ctx) => {
      if (ctx.scene.step.firstTime || !ctx.text) {
        return ctx.send('What\'s your name?')
      }

      ctx.scene.state.firstName = ctx.text

      return ctx.scene.step.next()
    },
    (ctx) => {
      if (ctx.scene.step.firstTime || !ctx.text) {
        return ctx.send('How old are you?')
      }

      ctx.scene.state.age = Number(ctx.text)

      return ctx.scene.step.next()
    },
    async (ctx) => {
      const { firstName, age } = ctx.scene.state

      await ctx.send(`👤 ${firstName}, age: ${age}`)

      return ctx.scene.step.next()
    }
  ])
])

aitu.updates.startPolling()
