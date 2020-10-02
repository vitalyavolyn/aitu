import { Middleware } from 'middleware-io'
import {
  Context,
  FormContext,
  InlineCommandSelectedContext,
  MessageContext,
  QuickButtonSelectedContext
} from './contexts'

export interface SessionContext<SessionData = Record<string, unknown>> extends Context {
  session: SessionData
}

type SupportedContext =
MessageContext | FormContext |
InlineCommandSelectedContext | QuickButtonSelectedContext

/**
 * Returns session manager middleware
 */
export function session<SessionData = Record<string, unknown>> (
  store = new Map<string, { session: SessionData }>(),
  getSessionKey = (ctx: SupportedContext) => ctx.sender?.id
): Middleware<(SupportedContext) & SessionContext<SessionData>> {
  return async (ctx, next) => {
    const key = getSessionKey(ctx)
    if (!key) return next()

    const entry = store.get(key) || { session: {} }
    Object.assign(ctx, { ...entry })

    await next()
    store.set(key, { session: ctx.session! })
  }
}
