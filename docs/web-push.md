# Браузерные push-уведомления через Firebase

Подключение сделано для кабинета **forwarder** по контракту сервиса уведомлений.
Схема: браузер получает FCM-токен → WordPress выдаёт notif-токен → сервис
уведомлений сохраняет FCM-токен с Bearer-авторизацией → профиль сохраняет `pushEnabled`.
Отправку самих сообщений выполняет бэкенд, а не React.

## 1. Заполнить настройки Firebase

В [Firebase Console](https://console.firebase.google.com/) открой существующий проект
**logistics-d2ca7** → шестерёнка → **Project settings** → **General** → **Your apps**.
Выбери веб-приложение и открой **SDK setup and configuration → Config**.

Скопируй `.env.example` в `.env` в корне проекта и заполни соответствия:

| Поле из Firebase | Переменная в `.env` |
| --- | --- |
| `apiKey` | `VITE_FIREBASE_API_KEY` |
| `authDomain` | `VITE_FIREBASE_AUTH_DOMAIN` |
| `projectId` | `VITE_FIREBASE_PROJECT_ID` |
| `messagingSenderId` | `VITE_FIREBASE_SENDER_ID` |
| `appId` | `VITE_FIREBASE_APP_ID` |

Далее **Project settings → Cloud Messaging → Web Push certificates**:
скопируй **существующий публичный** VAPID-ключ в `VITE_FIREBASE_VAPID_KEY`.
Ключ общий для prod и staging. **Не генерируй новую пару ключей**.
Если сертификата нет, уточни ключ у бэкенда, прежде чем создавать новый.

Это публичная конфигурация веб-приложения. JSON сервисного аккаунта, private key
и серверные ключи сюда добавлять нельзя. `.env` исключён из Git.
`.env.ftp` содержит только настройки FTP и для Firebase не используется.

После изменения `.env` перезапусти `npm run dev` или выполни новую сборку.

## 2. Проверить конфигурацию WordPress

На странице кабинета WordPress должен выдавать существующий объект:

```js
window.APP_DATA = {
  // ...остальные настройки приложения
  nonce: "<действующий WP nonce>",
  mode: "staging", // на prod значение другое
};
window.NotifWS_Config = {
  // ...существующие настройки сокета
  push: "https://notification.staging.360logistics.kz/api/push-token", // staging
};
```

Используй настоящий адрес из бэкенда; приложение не подставляет придуманный endpoint.
Для staging используется отдельный домен `notification.staging.360logistics.kz`,
без `/staging` в пути. Значение `push` нужно исправлять в конфигурации WordPress,
которая выводит `NotifWS_Config` на странице. Для prod используй адрес от бэкенда.
Для внешнего сервиса нужен CORS, разрешающий origin кабинета, методы POST/DELETE
и заголовки Authorization/Content-Type.

WordPress-запрос `GET /wp-json/notif/v1/token` использует WP nonce.
Затем отдельный HTTP-клиент отправляет:

```http
POST <NotifWS_Config.push>
Authorization: Bearer <notif-токен>
Content-Type: application/json

{"role":"forwarder","token":"<FCM-токен>","device":"web"}
```

После успешного POST приложение вызывает `POST /wp-json/forwarder/profile/v1/update`
с телом `{"pushEnabled":true}`. При отказе в разрешении флаг не сохраняется.
При ошибке обновления профиля приложение пробует удалить только что зарегистрированный токен.

Выключение галочки отправляет `{"pushEnabled":false}` в обновление профиля.
Бэкенд удаляет все push-токены пользователя. Ошибка, включая 502, оставляет галочку
в предыдущем состоянии и показывает сообщение.

## 3. Разместить service worker

`npm run build` создаёт **`dist/firebase-messaging-sw.js`** вместе с приложением.
Конфигурация подставляется автоматически из `.env`; версия SDK в воркере берётся
из установленного пакета `firebase`. Воркера вручную редактировать не нужно.

Размести этот файл на том же домене, где открыт кабинет:

| Среда | URL воркера | scope |
| --- | --- | --- |
| prod | `/firebase-messaging-sw.js` | `/` |
| staging | `/staging/firebase-messaging-sw.js` | `/staging/` |

Один и тот же сгенерированный файл можно разместить по обоим адресам, если используется
одна конфигурация Firebase. Среда выбирается через `APP_DATA.mode === "staging"`.
Разные регистрации воркера создают разные браузерные push-подписки.

**Нюанс Firebase SDK:** при одном origin и одном `appId` SDK хранит токен в общей записи
IndexedDB. При переключении между подписками prod/staging предыдущий FCM-токен
может быть отозван. Для одновременной независимой работы обеих сред зарегистрируй
ещё одно **Web app в том же проекте logistics-d2ca7** и заполни его `appId`
в `VITE_FIREBASE_STAGING_APP_ID`. API key, projectId, sender ID и существующий VAPID
остаются общими. Код поддерживает этот вариант и в приложении, и в воркере.
Пока staging appId не задан, staging использует основной appId с указанным ограничением.
Это следует из [ключа хранилища Firebase SDK](https://github.com/firebase/firebase-js-sdk/blob/main/packages/messaging/src/internals/idb-manager.ts)
и [замены токена при смене подписки](https://github.com/firebase/firebase-js-sdk/blob/main/packages/messaging/src/internals/token-manager.ts).

**Обычная FTP-выгрузка может отправлять `dist` в каталог assets.** В таком случае она
не разместит воркер по указанным URL: попроси администратора сервера отдельно
разместить `firebase-messaging-sw.js` в корне сайта и в `/staging/`.
Ответ должен содержать JavaScript с правильным Content-Type, без редиректа на вход,
HTML-страницы или долгого кеширования. Сайт должен работать по HTTPS.
В CSP должны быть разрешены загрузки Firebase SDK с `https://www.gstatic.com`
и подключения Firebase, нужные для Cloud Messaging.

`npm run dev` обслуживает оба URL воркера для локальной проверки на localhost.
Для работы самого кабинета локально по-прежнему нужны APP_DATA, действующий nonce
и доступ к WordPress API. `npm run preview` не заменяет размещение воркера в корне сайта.

## 4. Проверить полный сценарий

1. Открой кабинет и профиль. Включи галочку «Push-уведомления в браузере».
2. Разреши уведомления в запросе браузера.
3. В DevTools → Network проверь порядок: Firebase → `/notif/v1/token` → POST в
   `NotifWS_Config.push` → обновление профиля с `pushEnabled: true`.
4. Перезагрузи страницу. При `pushEnabled: true` и разрешении `granted` токен снова
   получается через `getToken` и отправляется в сервис. Нового запроса разрешения нет.
5. Сверни вкладку и отправь тестовое сообщение на FCM-токен из Firebase Console или
   через бэкенд. Токен можно посмотреть в теле POST-запроса регистрации в DevTools.
6. На активной вкладке дополнительного Firebase-попапа нет: сообщения показывает сокет.
7. Выключи галочку. Убедись, что в профиль отправлено `pushEnabled: false`.
8. Включи снова, затем выйди из аккаунта: перед `/auth/v1/logout` должен пройти
   DELETE в `NotifWS_Config.push` с телом `{"role":"forwarder","token":"<FCM-токен>"}`.
   При ошибке очистки выход не продолжается; можно повторить попытку.

Бэкенд отправляет **data-only** сообщения, без поля `notification`:

```json
{
  "data": {
    "title": "Начата загрузка",
    "body": "Водитель начал загрузку по рейсу №1024",
    "link": "https://360logistics.kz/customer/leads/6721f0c2a8b4e93d1c0f5a17",
    "type": "shipping.loading_started.6721f0c2a8b4e93d1c0f5a17"
  }
}
```

Воркер сам показывает уведомление. `title` и `body` отображаются как присланы,
без повторного перевода. Все значения в `data` — строки.
По клику используется **`data.link`**; поле `data.url` не используется.
Разрешены HTTPS-ссылки на `360logistics.kz`, `forwarder.360logistics.kz`
и текущий origin. Если `link` пустой, некорректный или ведёт на посторонний домен,
открывается главная текущего кабинета (`/forwarder/` или `/staging/forwarder/`).
Ссылка на прод, присланная в staging, открывается как прислана: среду и роль в ней
должен правильно указывать бэкенд. Если целевая страница уже открыта и видна воркеру,
воркер переключается на неё; иначе открывает новую вкладку.

Защита `if (payload.notification) return` сохранена для тестов из Firebase Console:
такие сообщения Firebase показывает автоматически, и второй показ не нужен.

Если браузер заблокировал уведомления, разреши их в настройках сайта.
В Safari на iOS web-push доступен для сайта, добавленного на экран «Домой».
Доставка при полностью закрытом браузере зависит от браузера и настроек ОС.

## Проверки кода

Если браузер уже получил разрешение, повторного запроса разрешения не будет.
При ошибке после клика на галочку открой DevTools → Console: запись `[WebPush]`
содержит `stage`, `code`, `status` и исходное сообщение без HTTP-заголовков и токенов.
`service-worker` означает ошибку загрузки/активации воркера, `firebase-token` — получение
FCM-токена, `notification-auth` — авторизацию, `push-register` — регистрацию токена,
`profile-update` — сохранение флага профиля.

При `service-worker` проверь URL воркера из раздела 3. HTTP 404, HTML вместо JavaScript
или редирект на вход мешают регистрации. Файл из `dist` нужно разместить именно
по адресу воркера; копии в assets недостаточно.

```sh
node --test tests/web-push.test.js
npm run build
```

Документация Firebase:
[настройка клиента](https://firebase.google.com/docs/cloud-messaging/web/get-started),
[приём сообщений](https://firebase.google.com/docs/cloud-messaging/web/receive-messages).
