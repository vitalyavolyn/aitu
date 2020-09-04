import { KeyboardBuilder } from './index'
import { AllowArray } from '../../types'
import { InlineCommand, QuickButtonCommand, ReplyCommand } from '../../interfaces'

export interface ProxyButton {
  kind: 'inlineCommand' | 'quickButtonCommand' | 'replyCommand'
  options: InlineCommand | QuickButtonCommand | ReplyCommand
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

  public static quickButtonCommand (options: QuickButtonCommand): ProxyButton {
    return { options, kind: 'quickButtonCommand' }
  }

  public static replyCommand (options: ReplyCommand): ProxyButton {
    return { options, kind: 'replyCommand' }
  }
}
