export interface setWebhookParams {
  url: string
}

/**
 * Change bot's webhook path
 * Use deleteWebhook to remove afterwards
 *
 * NOTE: protocol is required, only https is allowed
 * NOTE: you can't use polling when webhook is set
 */
export type setWebhook = (params: setWebhookParams) => Promise<{}>
