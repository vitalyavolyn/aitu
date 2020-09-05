import { KeyboardBuilder, FormAction } from '.'
import { AllowArray } from '../../types'

export interface ProxyButton {
  kind: 'inlineCommand' | 'quickButtonCommand' | 'replyCommand'
  options: InlineCommand | QuickButtonCommand | ReplyCommand
}

export interface InlineCommand {
  /** Button caption. Max length - 32, recommended - 20 */
  caption: string
  /** JSON or any string to be returned in InlineCommandSelected update */
  metadata: string
}

export interface QuickButtonCommand {
  /** Button caption. Max length - 32, recommended - 20 */
  caption: string
  /**
   * JSON or any string to be returned to a service as a parameter in
   * update QuickButtonSelected for processing and/or data used by client
   * to perform specific action
   *
   * More info: https://btsdigital.github.io/bot-api-contract/quickbuttoncommand.html
   */
  metadata: string
  action: 'QUICK_REQUEST' | 'QUICK_FORM_ACTION'
}

export interface QuickButtonCommandInput {
  /** Button caption. Max length - 32, recommended - 20 */
  caption: string
  /**
   * JSON or any string to be returned to a service as a parameter in
   * update QuickButtonSelected for processing and/or data used by client
   * to perform specific action
   *
   * More info: https://btsdigital.github.io/bot-api-contract/quickbuttoncommand.html
   */
  metadata: string | FormAction
  action: 'QUICK_REQUEST' | 'QUICK_FORM_ACTION'
}

export interface ReplyCommand {
  /** Button caption. Max length - 32, recommended - 20 */
  caption: string
}

export class Keyboard {
  public static builder (): KeyboardBuilder {
    return new KeyboardBuilder()
  }

  public static keyboard (rows: AllowArray<ProxyButton[]>): KeyboardBuilder {
    const builder = new KeyboardBuilder()

    for (const row of rows) {
      const buttons = Array.isArray(row) ? row : [row]

      for (const { kind, options } of buttons) {
        // @ts-expect-error
        builder[kind](options)
      }

      builder.row()
    }

    return builder
  }

  public static inlineCommand (options: InlineCommand): ProxyButton {
    return { options, kind: 'inlineCommand' }
  }

  public static quickButtonCommand (options: QuickButtonCommandInput): ProxyButton {
    if (typeof options.metadata !== 'string') {
      options.metadata = JSON.stringify(options.metadata)
    }

    return { options, kind: 'quickButtonCommand' }
  }

  public static replyCommand (options: ReplyCommand): ProxyButton {
    return { options, kind: 'replyCommand' }
  }
}
