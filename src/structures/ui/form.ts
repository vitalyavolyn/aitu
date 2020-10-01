/* eslint camelcase: ["error", { allow: ["bottom_bar"] } ] */
import { Header, Options, Content, BottomBar } from '.'
import { PartialBy } from '../../types'

export interface FormObject {
  /** JSON string with form object */
  jsonForm: string
}

export type FormMessage = FormObject | Form

export interface FormOptions {
  header: Header
  id: string
  content: Content[]
  options?: Options
  bottom_bar?: PartialBy<BottomBar, 'type'>
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
    this.bottom_bar = options.bottom_bar ? { ...options.bottom_bar, type: 'bottom_bar' } : undefined
  }

  public toJSON (): FormObject {
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
