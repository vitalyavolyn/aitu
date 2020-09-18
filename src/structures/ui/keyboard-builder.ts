import { InlineCommand, QuickButtonCommand, ReplyCommand, QuickButtonCommandInput } from '.'

export type KeyboardRow = (InlineCommand | QuickButtonCommand | ReplyCommand)[]

export class KeyboardBuilder {
  protected type: 'inline' | 'quick' | 'reply' | undefined
  protected rows: KeyboardRow[] = []
  protected currentRow: KeyboardRow = []

  public get [Symbol.toStringTag] (): string {
    return this.constructor.name
  }

  public inlineCommand (options: InlineCommand): this {
    this.ensureType('inline')

    if (options.caption.length > 32) {
      throw new RangeError('Maximum length of caption: 32 characters')
    }

    if (this.currentRow.length === 8) {
      throw new RangeError('Max count of columns is 8')
    }

    this.currentRow.push(options)
    return this
  }

  public quickButtonCommand (options: QuickButtonCommandInput): this {
    this.ensureType('quick')

    if (options.caption.length > 32) {
      throw new RangeError('Maximum length of caption: 32 characters')
    }

    if (this.currentRow.length === 25) {
      throw new RangeError('Max count of buttons is 25')
    }

    if (typeof options.metadata !== 'string') {
      options.metadata = JSON.stringify(options.metadata)
    }

    this.currentRow.push(options)
    return this
  }

  public replyCommand (options: ReplyCommand | string): this {
    this.ensureType('reply')

    if (typeof options === 'string') {
      options = { caption: options }
    }

    if (options.caption.length > 32) {
      throw new RangeError('Maximum length of caption: 32 characters')
    }

    this.currentRow.push(options)
    return this
  }

  private ensureType (type: 'inline' | 'quick' | 'reply') {
    if (this.type) {
      if (this.type !== type) throw new TypeError(`Can't mix ${this.type} with ${type} buttons`)
    } else {
      this.type = type
    }
  }

  public clone (): KeyboardBuilder {
    const builder = new KeyboardBuilder()

    builder.rows = [...this.rows]
    builder.currentRow = [...this.currentRow]
    builder.type = this.type

    return builder
  }

  public row (): this {
    if (this.currentRow.length === 0 || this.type !== 'inline') {
      return this
    }

    if (this.rows.length === 8) {
      throw new RangeError('Max count of rows is 8')
    }

    this.rows.push(this.currentRow)
    this.currentRow = []
    return this
  }

  public toJSON (): KeyboardRow | KeyboardRow[] {
    return this.type === 'inline'
      ? [...this.rows, this.currentRow].filter(row => row.length > 0)
      : this.currentRow
  }
}
