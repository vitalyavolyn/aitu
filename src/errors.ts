export interface ApiErrorParams {
  status: number
  message: string
}

export class ApiError extends Error {
  public code: number
  public stack!: string

  public constructor ({ status, message }: ApiErrorParams) {
    super(message)

    this.code = status
    this.name = this.constructor.name

    Error.captureStackTrace(this, this.constructor)
  }

  public get [Symbol.toStringTag] (): string {
    return this.constructor.name
  }
}
