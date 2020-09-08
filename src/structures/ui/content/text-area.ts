import { Options, ValidationRule } from '..'
import { BaseContent } from '.'

export interface TextArea extends BaseContent {
  /* eslint-disable camelcase */
  type: 'text_area'
  id: string
  /** Text displayed above the input */
  title?: string
  /** Default input value */
  text?: string
  /** Text to show in input when it's empty */
  placeholder?: string
  // insets
  options?: Options
  validations_rules?: ValidationRule[]
  /* eslint-enable camelcase */
}
