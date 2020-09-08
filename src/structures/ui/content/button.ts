import { Options, FormAction } from '..'
import { BaseContent } from '.'

export interface Button extends BaseContent {
  /* eslint-disable camelcase */
  type: 'button'
  id: string
  title?: string
  button_type?: 'default' | 'default_by_content' | 'alternative'
  // background_color, item_right_icon_resource, item_left_icon_resource, text_color, indent_outer
  options?: Options
  form_action?: FormAction
  /* eslint-enable camelcase */
}
