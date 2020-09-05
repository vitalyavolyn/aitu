export interface ValidationRule {
  type: 'required' | 'min_length' | 'max_length' | 'min' | 'max' | 'min_count'
  value: string
  error: string
}
