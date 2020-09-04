export type getWebhookInfoResponse = {
  url: string
}

export type getWebhookInfo = () => Promise<getWebhookInfoResponse>
