import { Options, ValidationRule } from '..'
import { BaseContent } from '.'

export interface DatePicker extends BaseContent {
  /* eslint-disable camelcase */
  type: 'date_picker'
  id: string
  title?: string
  placeholder?: string
  /** DD-MM-YYYY */
  selected_date?: string
  // min_date, max_date
  options?: Options
  validations_rules?: ValidationRule[]
}
