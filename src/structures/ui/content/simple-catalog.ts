import { Options, FileMetadata, FormAction } from '..'
import { BaseContent } from '.'

export interface SimpleCatalogItemButton {
  /* eslint-disable camelcase */
  title: string
  form_action: FormAction
}

export interface SimpleCatalogItem {
  id: string
  title?: string
  subtitle?: string
  description?: string
  form_action?: FormAction
  file_metadata?: FileMetadata
  item_buttons?: SimpleCatalogItemButton[]
  options?: Options
}

export interface SimpleCatalog extends BaseContent {
  type: 'simple_catalog'
  id: string
  items: SimpleCatalogItem[]
  // indent_outer, search_enabled
  options?: Options
}
