import { Options, FileMetadata } from '..'
import { BaseContent } from '.'

export interface SliderItem {
  /* eslint-disable camelcase */
  id: string
  file_metadata: FileMetadata
  /* eslint-enable camelcase */
}

export interface Slider extends BaseContent {
  type: 'slider'
  id?: string
  items: SliderItem[]
  // indent_outer
  options?: Options
}
