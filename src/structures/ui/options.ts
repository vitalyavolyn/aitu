import { Indent, FlexOptions } from '.'

// TODO: split properties into options for different types?
export interface Options {
  /* eslint-disable camelcase */
  title?: string
  fullscreen?: boolean
  type?: 'list' | 'horizontal_list' | 'grid'
  closeable?: boolean
  /** Content width in percentage */
  width?: number
  /** Content height in percentage */
  height?: number
  shape?: string
  background?: 'card' | 'border'
  alignment?: 'right' | 'left'
  orientation?: 'vertical' | 'horizontal'
  currency?: string
  item_type?: 'item_card' | 'item_numbered_bracket' | 'item_numbered' | 'item_bulleted'
  columns_count?: number
  search_enabled?: boolean
  media_type?: 'photo' | 'video' | 'any'
  choice_type?: string
  text_size?: 'H1' | 'H2' | 'H3' | 'H4'
  max_count?: number
  max_length?: number
  text_style?: 'bold' | 'normal'
  text_color?: string
  show_divider?: boolean
  item_right_icon_resource?: string
  indent_inner?: Indent
  indent_outer?: Indent
  input_type?: 'text' | 'number' | 'money' // pyAitu has 'double', but it's deprecated i guess
  should_open_editor?: boolean
  background_color?: string
  item_left_icon_resource?: string
  flex_options?: FlexOptions
  divider_type?: string
  has_back_action?: boolean
  /** DD-MM-YYYY */
  min_date?: string
  /** DD-MM-YYYY */
  max_date?: string
}
