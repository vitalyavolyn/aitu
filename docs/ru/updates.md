# Updates

```js
const { updates } = aitu
```

## isStarted

Запущено ли получение обновлений

```js
updates.isStarted // => boolean
```

## startPolling

Запускает запрос сервера для получения обновлений

> Обратите внимание: нельзя запустить polling, если установлен вебхук. Для удаления вебхука используйте `aitu.api.deleteWebhook()`

```js
updates.startPolling(); // => Promise
```

## startWebhook

Запускает webhook сервер

```js
updates.startWebhook(options) // => Promise
```

|Параметр|Тип|Описание|
|--|--|--|
|options|Object|Опции|

Опции (все - необязательные)

|Свойство|Тип|Описание|
|--|--|--|--|
|path|string|Путь обработки запроса|
|port|number|Порт сервера|
|tls|[TlsOptions](https://nodejs.org/docs/latest/api/https.html#https_https_createserver_options_requestlistener)|TLS - опции для https сервера|

Если адрес не задан, то будет использоваться /.

Если порт не задан, то будет использоваться 80 для http, 443 для https

## stop

Останавливает любое получение обновлений

```js
updates.stop() // => Promise
```

## getWebhookCallback

Возвращает callback, совместимый с `express` и стандартным `http[s].createServer()`

updates.getWebhookCallback(path); // Function

|Параметр|Тип|Описание|По умолчанию|
|--|--|--|--|
|path|string|Путь webhook'а|`/`|

Пример использования

```js
http.createServer(updates.getWebhookCallback('/webhook'))
```

## getKoaWebhookMiddleware

Возвращает middleware для [koa](https://github.com/koajs/koa)

Пример использования ([полный пример](../../examples/koa-webhook.ts))

```js
app.use(updates.getKoaWebhookMiddleware())

router.post('/webhook', updates.getKoaWebhookMiddleware())
```

## use

Добавляет middleware в цепочку

```js
updates.use(middleware) // => this
```

Параметры .use()

|Параметр|Тип|Описание|
|--|--|--|
|middleware|Function|Middleware|

```js
updates.use(async (context, next) => {
  // ...
  await next();
  // Код после обработки всей цепочки middleware
})
```

Параметры middleware

|Параметр|Тип|Описание|
|--|--|--|
|context|[Context](./contexts/)|Контекст|
|next|Function|Переходит к следующему middleware|

## on

Подписывает на события

|Параметр|Тип|Описание|
|--|--|--|
|events|string, string[]|Список событий|
|handlers|Function, Function[]|Middleware (один или несколько)|

```js
updates.on('Message', (ctx) => {
  // ctx is MessageContext
  ctx.reply('hi!')
})
```
