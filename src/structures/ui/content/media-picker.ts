import { Options, ValidationRule } from '..'
import { BaseContent } from '.'

export interface MediaPicker extends BaseContent {
  /* eslint-disable camelcase */
  type: 'media_picker'
  id: string
  title: string
  // height, width, should_open_editor, max_count, media_type, indent_outer
  options?: Options
  validations_rules?: ValidationRule[]
  /* eslint-enable camelcase */
}
