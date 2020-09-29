export interface setWebhookParams {
  url: string
}

/**
 * Change bot's webhook path
 * NOTE: protocol is required, only https is allowed
 */
export type setWebhook = (params: setWebhookParams) => Promise<{}>
