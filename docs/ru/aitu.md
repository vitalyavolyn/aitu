# Aitu

```js
import { Aitu } from 'aitu'
```

## Constructor

Инициализация нового объекта

```js
const aitu = new Aitu(options)
```

Пример:

```js
const aitu = new Aitu({
  token: config.token,
  apiTimeout: 10 * 1000
})
```

|Параметр|Тип|Описание|
|--|--|--|
|options|Object|[AituOptions](#aituoptions)|

## setOptions

Устанавливает опции

```js
aitu.setOptions({
  token: newToken
})
```

|Параметр|Тип|Описание|
|--|--|--|
|options|Object|[AituOptions](#aituoptions)|

## AituOptions

|Параметр|Тип|Описание|По умолчанию
|--|--|--|--|
|token|string|Токен, полученный у @MasterService|undefined|
|agent|Agent|[https.Agent](https://nodejs.org/api/https.html#https_class_https_agent)|[https.globalAgent](https://nodejs.org/api/https.html#https_https_globalagent)|
|apiBaseUrl|string|Базовый URL для API|`https://messapi.btsdapps.net/bot/v1`|
|apiTimeout|number|Время ожидания запроса в мс|30000|
|apiHeaders|Object|Заголовки отправляемые вместе с запросом|`{ 'User-Agent': 'aitu/${version} (+https://github.com/vitalyavolyn/aitu.git)'}`|
|pollingTimeout|number|Время ожидания запроса при получении событий от LongPoll, мс|40000|
|pollingRetryLimit|number|Количество попыток повтора запроса после ошибки (сбрасывается после одного удачного запроса)|3|

## api

```js
const { api } = aitu
```

`.api()` предоставляет удобный интерфейс для взаимодействия с API Aitu.

Методы можно вызывать двумя способами:

```js
// Через прокси
api.setWebhook({ url: 'https://google.com' })
api.SendMessage({ content: 'text', recipient: { type: 'USER', id: 'uuid' } })

// Напрямую
api('setWebhook', { url: 'https://google.com' }
)
api('SendMessage', { content: 'text', recipient: { type: 'USER', id: 'uuid' } })
```

`api()`
|Параметр|Тип|Описание|По умолчанию
|--|--|--|--|
|method|string|Метод|undefined
|options|Object|Параметры|`{}`

`api.method()`
|Параметр|Тип|Описание|По умолчанию
|--|--|--|--|
|options|Object|Параметры|`{}`

Вызовы через прокси автоматически превращаются в вызовы напрямую, оба способа поддерживают подсказки параметров и результата.

В API Aitu есть два типа методов: команды (для взаимодействия с сообщениями и чатами) и методы (для изменения параметров вебхуков, получения информации о канале и т.п.)

Список команд и методов можно найти в документации к [bot-api-contract](https://btsdigital.github.io/bot-api-contract/endpoints.html) (официального проекта BTS Digital), либо в папке [api](../../src/api) этого проекта.

Метод всегда возвращает промис с ответом сервера или ошибкой

```js
aitu.api.getMe()
  .then(({ name }) => {
    console.log(name)
  })
```

## updates

Объект класса [Updates](updates.md)
