export interface getWebhookInfoResponse {
  url: string
}

/** Returns webhook URL */
export type getWebhookInfo = () => Promise<getWebhookInfoResponse>
