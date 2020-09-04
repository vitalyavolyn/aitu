export type getMeResponse = {
  botId: string
  name: string
  username: string
}

export type getMe = () => Promise<getMeResponse>
