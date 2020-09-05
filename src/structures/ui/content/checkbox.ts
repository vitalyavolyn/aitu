import { Options, ValidationRule } from '..'
import { BaseContent } from '.'

export interface Checkbox extends BaseContent {
  /* eslint-disable camelcase */
  type: 'checkbox'
  id: string
  title: string
  /** Is checked by default (default - true) */
  default_state?: boolean
  // text_size, text_color, indent_outer
  options?: Options
  validations_rules?: ValidationRule[]
}
