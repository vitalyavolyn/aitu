import { Options, FormAction } from '..'
import { BaseContent } from '.'

export type ButtonType = 'default' | 'default_by_content' | 'alternative'

export interface Button extends BaseContent {
  /* eslint-disable camelcase */
  type: 'button'
  id: string
  title?: string
  button_type?: ButtonType
  // background_color, item_right_icon_resource, item_left_icon_resource, text_color, indent_outer
  options?: Options
  form_action?: FormAction
  /* eslint-enable camelcase */
}
