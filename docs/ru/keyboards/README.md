# Keyboard

```js
import { Keyboard } from 'aitu'
```

> [Тесты, связанные с этим классом](../../../test/keyboards.test.ts). Там же можно посмотреть больше примеров использования классов Keyboard и KeyboardBuilder (пока его здесь нет).

## .builder() (static)

Возвращает новый сборщик клавиатуры

```js
Keyboard.builder() // => KeyboardBuilder
```

Пример использования

```js
updates.on('Message', ctx => {
  ctx.send('Hello!', {
    uiState: {
      replyKeyboard: Keyboard.builder()
        .replyCommand('Hello!')
    }
  })
})
```

## .keyboard() (static)

Генерирует клавиатуру из массива предоставленных данных

```js
Keyboard.keyboard(rows) // => KeyboardBuilder
```

Пример использования

```js
// ReplyKeybard с тремя кнопками

Keyboard.keyboard([
  Keyboard.replyCommand('string caption'),
  Keyboard.replyCommand({ caption: 'obj with caption' }),
  'string literal'
])

// Три кнопки с действиями
Keyboard.keyboard([
  Keyboard.quickButtonCommand({
    action: 'QUICK_REQUEST',
    caption: '1',
    metadata: ''
  }),
  Keyboard.quickButtonCommand({
    action: 'QUICK_FORM_ACTION',
    caption: '2',
     // объект сам превратится в JSON, позволяет
     // использовать типизацию для metadata
    metadata: { action: 'submit_form' }
  }),
  Keyboard.quickButtonCommand({
    action: 'QUICK_FORM_ACTION',
    caption: '3',
    metadata: '{"action":"submit_form"}'
  })
])

// Инлайн-клавиатура с тремя строками
Keyboard.keyboard([
  [
    Keyboard.inlineCommand({ caption: 'caption', metadata: 'meta' }),
    Keyboard.inlineCommand({ caption: 'caption', metadata: 'meta' })
  ],
  [
    Keyboard.inlineCommand({ caption: 'caption', metadata: 'meta' })
  ],
  // Если в строке одна кнопка - можно передать ее без массива
  Keyboard.inlineCommand({ caption: 'caption', metadata: 'meta' })
])
```

## .inlineCommand() (static)

Генерирует inline кнопку

```js
Keyboard.inlineCommand(options) // => InlineCommand
```

Свойства `options`

|Свойство|Тип|Описание|
|--|--|--|
|caption|String|Текст кнопки (максимум 32 символа)|
|metadata|String|Полезная нагрузка, вернется в InlineCommandSelected|

## .quickButtonCommand() (static)

Генерирует quickButton кнопку

```js
Keyboard.quickButtonCommand(options) // => QuickButtonCommand
```

Свойства `options`

|Свойство|Тип|Описание|
|--|--|--|
|caption|String|Текст кнопки (максимум 32 символа)|
|metadata|String / Object|Полезная нагрузка (вернется в QuickButtonSelected) или FormAction ([подробнее](https://btsdigital.github.io/bot-api-contract/quickbuttoncommand.html))|
|action|String|'QUICK_REQUEST' или 'QUICK_FORM_ACTION'|

## .replyCommand() (static)

Генерирует reply кнопку

```js
Keyboard.replyCommand(options) // => ReplyCommand
```

`options` может быть строкой или объектом со свойствами:

|Свойство|Тип|Описание|
|--|--|--|
|caption|String|Текст кнопки (максимум 32 символа)|
