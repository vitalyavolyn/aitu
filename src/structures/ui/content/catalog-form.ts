import { Options, FileMetadata, ValidationRule } from '..'
import { BaseContent } from '.'

export interface CatalogItem {
  /* eslint-disable camelcase */
  id: string
  title?: string
  subtitle?: string
  description?: string
  file_metadata?: FileMetadata
}

export interface Catalog {
  // title, ???
  options: Options
  items: Array<CatalogItem>
}

export interface CatalogForm extends BaseContent {
  type: 'catalog'
  id: string
  title?: string
  placeholder?: string
  default_value?: CatalogItem
  validations_rules?: ValidationRule[]
  // indent_outer, search_enabled
  options?: Options
  catalog?: Catalog
}
