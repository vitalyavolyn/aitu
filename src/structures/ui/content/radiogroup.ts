import { Options, ValidationRule } from '..'
import { BaseContent } from '.'

export interface RadioItem {
  id: string
  title?: string
}

export interface Radiogroup extends BaseContent {
  /* eslint-disable camelcase */
  type: 'radiogroup'
  id: string
  title?: string
  items?: RadioItem[]
  // indent_outer, orientation
  options?: Options
  validations_rules?: ValidationRule[]
  default_value?: RadioItem
  /* eslint-enable camelcase */
}
