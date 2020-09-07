/* eslint camelcase: ["error", { allow: ["bottom_bar"] } ] */
import { Header, Options, Content, BottomBar } from '.'

export interface FormMessage {
  /** JSON string with form object */
  jsonForm: string
}

export interface FormOptions {
  header: Header
  id: string
  content: Content[]
  options?: Options
  bottom_bar?: BottomBar
}

export class Form {
  public header: Header
  public id: string
  public content: Content[]
  public options?: Options
  public bottom_bar?: BottomBar

  public constructor (options: FormOptions) {
    this.header = options.header
    this.id = options.id
    this.content = options.content
    this.options = options.options
    this.bottom_bar = options.bottom_bar
  }

  public toJSON (): FormMessage {
    const { id, header, content, options, bottom_bar } = this

    return {
      jsonForm: JSON.stringify({
        form: {
          id,
          header,
          content,
          options,
          bottom_bar
        }
      })
    }
  }
}
