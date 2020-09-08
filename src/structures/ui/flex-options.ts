export interface FlexOptions {
  /* eslint-disable camelcase */
  flex_grow?: number
  flex_basis?: number
  flex_direction?: 'row' | 'column' | 'row_revers' | 'column_revers'
  flex_wrap?: string
  align_items?: 'baseline' | 'start' | 'center' | 'end'
  align_self?: 'baseline' | 'start' | 'center' | 'end' | 'stretch'
  justify_content?: 'around' | 'center' | 'evenly' | 'between' | 'end'
  /* eslint-enable camelcase */
}
