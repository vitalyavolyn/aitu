export interface getMeResponse {
  botId: string
  name: string
  username: string
}

export type getMe = () => Promise<getMeResponse>
