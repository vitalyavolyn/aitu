import { Indent, FlexOptions } from '.'

// pyAitu has 'double', but it's deprecated i guess
export type InputType = 'text' | 'number' | 'money'

export type CatalogItemType =
'item_card' | 'item_numbered_bracket' | 'item_numbered' | 'item_bulleted' | 'item_info'

export type CatalogType = 'list' | 'horizontal_list' | 'grid'

export type Alignment = 'right' | 'left' | 'center_horizontal'

export type Orientation = 'vertical' | 'horizontal'

export type TextSize = 'H1' | 'H2' | 'H3' | 'H4'

export type TextStyle = 'bold' | 'normal'

export type MediaPickerMediaType = 'photo' | 'video' | 'any'

export type Currency = 'BYR' | 'CHF' | 'CNY' | 'EUR' | 'GBP' | 'JPY' | 'KZT' | 'RUB' | 'UAH' | 'USD'

export type CardBackground = 'card' | 'border'

// TODO: split properties into options for different types?
export interface Options {
  /* eslint-disable camelcase */
  title?: string
  fullscreen?: boolean
  /** Catalog type */
  type?: CatalogType
  closeable?: boolean
  /** Content width in percentage */
  width?: number
  /** Content height in percentage */
  height?: number
  shape?: string
  background?: CardBackground
  alignment?: Alignment
  orientation?: Orientation
  currency?: Currency
  /** Catalog item type */
  item_type?: CatalogItemType
  columns_count?: number
  search_enabled?: boolean
  media_type?: MediaPickerMediaType
  choice_type?: string
  text_size?: TextSize
  max_count?: number
  max_length?: number
  text_style?: TextStyle
  text_color?: string
  show_divider?: boolean
  item_right_icon_resource?: string
  indent_inner?: Indent
  indent_outer?: Indent
  input_type?: InputType
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
  /* eslint-enable camelcase */
}
