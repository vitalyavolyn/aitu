import {
  Button, DatePicker, Submit,
  Divider, Checkbox, CustomContainer,
  CardContainer, Text, Image,
  Input, LabeledText, MediaPicker,
  Radiogroup, Switch, TextArea,
  UserInfo, ItemInfo, Slider,
  SimpleCatalog, CatalogForm
} from '.'

export interface BaseContent {
  type: string
  id?: string
}

export type Content =
Button | DatePicker | Submit | Divider |
Checkbox | CustomContainer | Text | Image |
Input | LabeledText | MediaPicker | Radiogroup |
Switch | TextArea | UserInfo | ItemInfo |
Slider | SimpleCatalog | CatalogForm

export type CardContent = CardContainer | CustomContainer | Divider | Image | Text
