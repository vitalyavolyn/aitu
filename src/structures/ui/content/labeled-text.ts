import { Options } from '..'
import { BaseContent } from '.'

export interface LabeledText extends BaseContent {
  /* eslint-disable camelcase */
  type: 'labeled_text'
  id: string
  title: string
  label: string
  // indents
  options?: Options
}
