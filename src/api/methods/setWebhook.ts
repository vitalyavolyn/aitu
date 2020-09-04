export interface setWebhookParams {
  url: string
}

export type setWebhook = (params: setWebhookParams) => Promise<{}>
