# Android: Capacitor

В проект добавлен Capacitor 8. Android-проект находится в `android/`, идентификатор
приложения — `kz.logistics360.forwarder`, название — Forwarder.
Включён встроенный `CapacitorHttp`: Axios/XHR и fetch используют нативный
HTTP-транспорт, поэтому запросы к API не блокируются браузерным CORS.

## Открыть и запустить

Из корня проекта:

```powershell
npm install
npm run android:open
```

Команда собирает интерфейс, синхронизирует его с Android-проектом и открывает
папку `android/` в Android Studio. Дождитесь Gradle Sync, выберите эмулятор
или подключённый телефон и нажмите **Run ▶** для конфигурации **app**.

Открывать через **File → Open** нужно именно `android/`, а не корень React-проекта.
Перед ручным открытием выполните `npm run android:sync`.

Для установки и запуска из терминала:

```powershell
npm run android:run
# Если подключено несколько устройств:
npm run android:run -- --target emulator-5554
```

На первом холодном запуске медленного эмулятора `native-run` может превысить
свой пятисекундный таймаут ADB и вывести `device still authorizing`, хотя
приложение уже установлено. Дождитесь состояния `device` в `adb devices`
и повторите команду, либо запустите **app** кнопкой Run в Android Studio.

После изменения React-компонентов выполните `npm run android:sync` и снова
нажмите Run в Android Studio. Нативная сборка использует упакованные файлы;
запускать `npm run dev` не требуется.

## Инструменты

- Node.js 22 или новее.
- Android Studio 2025.2.1 или новее.
- JDK **21**. Java 25 из новых Android Studio несовместима с Gradle 8.14.3.
- Android SDK Platform **36**, Build Tools **35.0.0**, Android SDK Platform-Tools.
- Эмулятор Android 7+ с актуальным WebView либо телефон с USB debugging.

Скрипт `tooling/android.mjs` находит JDK 21 в `JAVA_HOME` или внутри
`.android-tools/` и Android SDK в `ANDROID_HOME` / `ANDROID_SDK_ROOT` либо
стандартной папке пользователя. Он создаёт локальные настройки SDK и JDK
для Android Studio. Эти пути и скачанные инструменты не попадают в Git.

На другом компьютере установите [JDK 21](https://learn.microsoft.com/en-us/java/openjdk/download)
и задайте `JAVA_HOME`, либо распакуйте архив JDK в `.android-tools/`.
SDK-компоненты устанавливаются через **Tools → SDK Manager**.
Если Studio предлагает Java 25, выберите **Settings → Build, Execution,
Deployment → Build Tools → Gradle → Gradle JDK → GRADLE_LOCAL_JAVA_HOME**
или укажите JDK 21. Локальный Gradle-кэш команд находится в `.gradle-cache/`.

## Сборка и окружение

Обычная команда `npm run build` собирает библиотеку для сайта. Для Android
используется отдельный `vite.android.config.js`: полноценная HTML-страница,
локальные ресурсы и отдельная папка `dist-android/`.

По умолчанию Android собирается для **staging** (`--mode dev`), API берётся
из `VITE_API_URL_DEV` в `.env.ftp`. Для production:

```powershell
npm run android:sync:prod
npx cap open android
```

Можно переопределить API через `VITE_API_URL` в `.env.dev.local` или
`.env.prod.local`. Адрес должен быть HTTPS и включать путь API (`/wp-json`).
Адрес API входит в клиентскую сборку; серверные секреты в Vite-переменные
добавлять нельзя.

Чтобы получить отладочный APK для staging:

```powershell
npm run android:apk
```

Результат: `android/app/build/outputs/apk/debug/app-debug.apk`.
Релизная подпись для публикации в Google Play не настроена.

## Данные и авторизация

Веб-версия получает `window.APP_DATA`, WordPress nonce и авторизованную
сессию от сервера. В локальной Android-сборке такого серверного HTML нет:
начальные `APP_DATA` содержат окружение, пустые `features` и пустой nonce.
Перед открытием кабинета приложение проверяет сессию через API профиля.
Неавторизованный пользователь переходит на существующую страницу входа:
`/staging/auth/login` для staging или `/auth/login` для production.
Истечение сессии во время работы также вызывает переход на вход.
Страницы входа, регистрации и восстановления пароля доступны без сессии.

Это позволяет проверять загрузку и отображение мобильного интерфейса.
Полноценные операции с данными требуют отдельной проверки и подключения
авторизации для мобильного клиента: API должен поддерживать сессию/токен
и выдавать актуальные настройки пользователя. Сессия браузера на компьютере
в приложение не переносится.
Не следует вшивать nonce или cookies пользователя в сборку.

Нативный HTTP получает ответы API без ошибок CORS. Ответ `401` и ошибка
`403 rest_cookie_invalid_nonce` вызывают переход на вход. Обычный `403`,
ошибки сервера и отсутствие сети не считаются выходом из аккаунта.

Вход, серверные перенаправления, ЭЦП, загрузка документов и push-уведомления
требуют отдельного тестирования с сервером и учётной записью.
Нативный Firebase push-плагин и `google-services.json` пока не подключены.

Документация: [Capacitor Android](https://capacitorjs.com/docs/android),
[CapacitorHttp](https://capacitorjs.com/docs/apis/http).
