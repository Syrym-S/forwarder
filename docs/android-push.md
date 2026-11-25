# Push-уведомления Android

В Android используется `@capacitor/push-notifications` и нативный
`ForwarderMessagingService`. Браузерный Service Worker из `Solutions_DRIVER_MOB`
работает для сайта; для закрытого Capacitor-приложения сообщения обрабатывает
Android-сервис без React и WebView.

Идентификатор Android-приложения — `kz.logistics.forwarder`: он совпадает с
зарегистрированным Forwarder в предоставленном `google-services.json` проекта
`logistics-d2ca7`. Старый APK с `kz.logistics360.forwarder` — другая установка;
проверять нужно новую сборку `kz.logistics.forwarder`.

## Быстро запустить production на эмуляторе

```powershell
npm run android:run:prod -- --target emulator-5554
```

Войдите в аккаунт, откройте настройки, включите «Push-уведомления» и разрешите
уведомления Android. Сверните приложение кнопкой Home и отправьте новое
событие аккаунту Forwarder с сервера. Сообщение появится в шторке Android.

Локально проверить только показ в шторке при закрытом приложении:

```powershell
npm run android:push:demo -- emulator-5554
```

Команда работает с установленным debug APK и включёнными уведомлениями,
сворачивает приложение, запрашивает завершение фонового процесса и посылает
явно помеченное локальное уведомление. Эта команда не отправляет сообщение через FCM.
Тестовый receiver доступен только ADB/shell и отсутствует в release-сборке.

## Проверено на эмуляторе 25 ноября 2026

- Production API, debug APK с package `kz.logistics.forwarder`.
- Firebase инициализировался и выдал настоящий FCM-токен.
- Сервис `notification.v2.360logistics.kz` принял Android-токен:
  HTTP 200, `Push token saved`.
- Профиль вернул `pushEnabled: true`; локальное разрешение и обработчик включены.
- При закрытом интерфейсе получено настоящее тестовое FCM-уведомление `sdc`,
  видимое в шторке Android. Это отдельная проверка от локального demo.
- Сборка debug, конфигурация Firebase release и 58 JavaScript-тестов прошли.
- В итоговом release manifest нет `DebugPushReceiver`.

## Локальные автоматические тесты показа

1. Откройте проект командой `npm run android:open`, запустите эмулятор.
2. В Android Studio откройте
   `app/src/androidTest/java/kz/logistics360/forwarder/ForwarderPushTest.java`.
3. Нажмите Run рядом с классом `ForwarderPushTest` и выберите эмулятор.

Из терминала с уже запущенным эмулятором:

```powershell
npm run android:test:push
```

Тесты подают data-only сообщение прямо в нативный обработчик и проверяют:

- уведомление появляется без Activity и Capacitor bridge;
- повторная обработка одного сообщения не создаёт дубликат;
- после отключения уведомлений/выхода из аккаунта показ заблокирован;
- при открытом интерфейсе нет второго системного уведомления поверх WebSocket.

Тест выдаёт разрешение на уведомления на эмуляторе. После завершения он удаляет
тестовые уведомления и отключает локальный тестовый флаг доставки.
Эта проверка **не проверяет сетевую доставку через FCM**, закрытие настоящего
процесса системой, вход в аккаунт или серверную регистрацию Android-токена.

## Подключить настоящую доставку

1. В существующем Firebase-проекте, которым пользуется сервер уведомлений,
   используйте Android-приложение с package name **`kz.logistics.forwarder`**.
2. Скачайте его `google-services.json` и положите в
   **`android/app/google-services.json`**. Файл для `kz.logistics.driver` не подходит;
   менять package name в чужом файле нельзя.
3. Выполните `npm run android:open` и Run для конфигурации `app`.
4. Войдите в тестовый аккаунт. В настройках включите «Push-уведомления»
   и разрешите показ в Android. Приложение получает Android FCM-токен,
   отправляет его существующему `/api/push-token` с `role: "forwarder"`,
   `device: "android"`, затем сохраняет `pushEnabled` в профиле.

Без Firebase-конфига сборка останавливается с ошибкой, чтобы не устанавливать
APK без рабочего подключения Firebase. Android не использует
браузерный VAPID-ключ. Сервер должен принимать `device: "android"` и отправлять
токены в тот же Firebase-проект; это нужно проверить на сервере.

Конфигурация сервиса `NotifWS_Config` / `NotificationWS_Config` читается из
серверного HTML при нативном запуске, рядом с `APP_DATA`, без выполнения JS.
Если сервер её не отдаёт, появится ошибка отсутствующего адреса push-сервиса.
Токен заново регистрируется при запуске и возвращении в приложение.
При выключении настройки сервер удаляет устройства пользователя, а локальный
обработчик блокируется. При logout удаляется токен текущего устройства.

## Проверить доставку, когда приложение закрыто

Используйте эмулятор с Google Play / Google APIs или телефон с Google Play services.
Отправьте сообщение на зарегистрированный **Android** FCM-токен через тестовый
сервер в формате FCM HTTP v1:

```json
{
  "message": {
    "token": "ANDROID_FCM_TOKEN",
    "android": { "priority": "high" },
    "data": {
      "title": "Проверка Forwarder",
      "body": "Уведомление при закрытом приложении",
      "link": "/forwarder/leads/TEST_LEAD_ID",
      "type": "shipping.loading_started.TEST_LEAD_ID"
    }
  }
}
```

Поле `notification` не требуется: нативный сервис показывает `data.title` и
`data.body`. Используйте существующий тестовый заказ, без production-событий.
Проверяйте последовательно: приложение открыто; Home; удаление из недавних;
заблокированный экран. Нажатие на уведомление открывает приложение и заказ.

Для проверки завершённого процесса: нажмите Home и выполните
`adb shell am kill kz.logistics.forwarder`, убедитесь через `adb shell pidof
kz.logistics.forwarder`, что процесса нет, затем отправьте новое FCM-сообщение.
Не используйте `am force-stop` или кнопку Stop в Android Studio для этого сценария.

«Принудительно остановить» в настройках Android блокирует доставку до следующего
ручного запуска. Выход из аккаунта также отключает сообщения этого устройства.
Обычное сворачивание и закрытие интерфейса не отключают подписку. Доставку могут
задерживать сеть, Doze и ограничения производителя; для видимых data-only
уведомлений серверу нужен Android high priority.

Документация: [Capacitor Push](https://capacitorjs.com/docs/apis/push-notifications),
[приём FCM на Android](https://firebase.google.com/docs/cloud-messaging/android/receive-messages),
[условия доставки и force-stop](https://firebase.google.com/docs/cloud-messaging/flutter/receive).
