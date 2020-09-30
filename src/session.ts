import { Middleware } from 'middleware-io'
import { FormContext, MessageContext } from './contexts'

/**
 * Returns session manager middleware
 */
export function session<SessionData extends Record<string, unknown>> (
  store = new Map<string, { session: SessionData }>(),
  getSessionKey = (ctx: MessageContext | FormContext) => ctx.sender?.id
): Middleware<(MessageContext | FormContext) & { session?: SessionData }> {
  return async (ctx, next) => {
    const key = getSessionKey(ctx)
    if (!key) return next()

    const entry = store.get(key) || { session: {} }
    Object.assign(ctx, { ...entry })

    await next()
    store.set(key, { session: ctx.session! })
  }
}
