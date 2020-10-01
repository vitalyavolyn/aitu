export interface getMeResponse {
  botId: string
  name: string
  username: string
}

/** Returns info about the service */
export type getMe = () => Promise<getMeResponse>
