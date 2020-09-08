import { Options, ValidationRule } from '..'
import { BaseContent } from '.'

export interface Input extends BaseContent {
  /* eslint-disable camelcase */
  type: 'input'
  id: string
  /** Text displayed above the input */
  title?: string
  /** Default input value */
  text?: string
  /** Text to show in input when it's empty */
  placeholder?: string
  /**
   * @example
   * // Phone number
   * '+7 [___] [_______]'
   *
   * // 6 numbers in groups of 3
   * '[___ ___]'
   */
  mask?: string
  // input_type, currency, indent_outer
  options?: Options
  validations_rules?: ValidationRule[]
  /* eslint-enable camelcase */
}
