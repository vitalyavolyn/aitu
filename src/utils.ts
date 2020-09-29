import { IncomingMessage } from 'http'

export const pickProperties = <
  T,
  K extends keyof T
>(params: T, properties: K[]): Pick<T, K> => {
  const copies: Pick<T, K> = {} as Pick<T, K>

  for (const property of properties) {
    copies[property] = params[property]
  }

  return copies
}

export const parseReqJSON = async <T>(req: IncomingMessage): Promise<T> => {
  const chunks = []
  let totalSize = 0

  for await (const chunk of req) {
    totalSize += chunk.length

    chunks.push(chunk)
  }

  return JSON.parse(
    Buffer.concat(chunks, totalSize).toString('utf8')
  )
}
