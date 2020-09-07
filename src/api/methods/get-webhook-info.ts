export interface getWebhookInfoResponse {
  url: string
}

export type getWebhookInfo = () => Promise<getWebhookInfoResponse>
