# Angular Project Structure

Описание рекомендуемой файловой структуры Angular-приложения. Структура рассчитана на масштабируемый проект, где код разделён по зонам ответственности: ядро приложения, переиспользуемые элементы, функциональные модули, layout, state management, assets и окружения.

## Общая структура проекта

```text
my-angular-app/
├── .angular/
├── node_modules/
├── src/
│   ├── app/
│   │   ├── core/
│   │   │   ├── services/
│   │   │   ├── guards/
│   │   │   ├── interceptors/
│   │   │   ├── models/
│   │   │   └── constants/
│   │   │
│   │   ├── shared/
│   │   │   ├── components/
│   │   │   ├── directives/
│   │   │   ├── pipes/
│   │   │   └── utils/
│   │   │
│   │   ├── features/
│   │   │   ├── auth/
│   │   │   ├── dashboard/
│   │   │   ├── users/
│   │   │   └── reports/
│   │   │
│   │   ├── layout/
│   │   │   ├── header/
│   │   │   ├── sidebar/
│   │   │   └── footer/
│   │   │
│   │   ├── store/
│   │   │   ├── actions/
│   │   │   ├── reducers/
│   │   │   ├── effects/
│   │   │   └── selectors/
│   │   │
│   │   ├── app.routes.ts
│   │   ├── app.config.ts
│   │   └── app.component.ts
│   │
│   ├── assets/
│   │   ├── images/
│   │   ├── icons/
│   │   └── i18n/
│   │
│   ├── environments/
│   │   ├── environment.ts
│   │   └── environment.prod.ts
│   │
│   ├── styles.scss
│   ├── main.ts
│   └── index.html
│
├── .editorconfig
├── .gitignore
├── angular.json
├── package.json
├── tsconfig.json
└── README.md
```

## Описание директорий

### `.angular/`

Служебная директория Angular CLI.

Используется для хранения кэша сборки и внутренних файлов Angular. Обычно не редактируется вручную и не должна быть основной частью разработки.

---

### `node_modules/`

Директория с установленными npm-зависимостями.

Создаётся после выполнения:

```bash
npm install
```

Не добавляется в Git, так как зависимости восстанавливаются из `package.json` и `package-lock.json`.

---

### `src/`

Основная директория с исходным кодом приложения.

Здесь находятся Angular-компоненты, маршруты, стили, конфигурации окружений, статические файлы и точка входа приложения.

---

## Структура `src/app`

### `app/`

Корневая директория приложения.

Содержит основную Angular-логику: конфигурацию приложения, маршруты, корневой компонент, общие сервисы, функциональные разделы и состояние приложения.

---

### `core/`

Ядро приложения.

В эту директорию помещается код, который используется на уровне всего приложения и обычно загружается один раз.

Пример содержимого:

```text
core/
├── services/
├── guards/
├── interceptors/
├── models/
└── constants/
```

#### `core/services/`

Глобальные сервисы приложения.

Примеры:

- сервис авторизации;
- сервис работы с API;
- сервис хранения токена;
- сервис уведомлений;
- сервис глобальных настроек.

#### `core/guards/`

Route guards для защиты маршрутов.

Примеры:

- проверка авторизации;
- проверка роли пользователя;
- запрет доступа к страницам без прав.

#### `core/interceptors/`

HTTP interceptors.

Используются для централизованной обработки HTTP-запросов и ответов.

Примеры:

- добавление `Authorization` header;
- обработка ошибок API;
- refresh token logic;
- глобальный loader для запросов.

#### `core/models/`

Глобальные TypeScript-модели и интерфейсы.

Примеры:

- `User`;
- `ApiResponse`;
- `Pagination`;
- `AuthToken`.

#### `core/constants/`

Глобальные константы приложения.

Примеры:

- API endpoints;
- роли пользователей;
- ключи localStorage;
- значения по умолчанию.

---

### `shared/`

Переиспользуемые элементы приложения.

Сюда помещается код, который может использоваться в разных feature-разделах и не содержит бизнес-логики конкретной страницы.

Пример структуры:

```text
shared/
├── components/
├── directives/
├── pipes/
└── utils/
```

#### `shared/components/`

Общие UI-компоненты.

Примеры:

- button;
- modal;
- input;
- loader;
- dropdown;
- table;
- pagination.

#### `shared/directives/`

Переиспользуемые Angular-директивы.

Примеры:

- autofocus;
- clickOutside;
- permissions directive;
- tooltip directive.

#### `shared/pipes/`

Переиспользуемые pipes.

Примеры:

- форматирование даты;
- форматирование валюты;
- сокращение текста;
- фильтрация значений.

#### `shared/utils/`

Вспомогательные функции.

Примеры:

- работа с датами;
- форматирование строк;
- валидация данных;
- маппинг API-ответов.

---

### `features/`

Функциональные разделы приложения.

Каждая папка внутри `features/` отвечает за отдельную бизнес-функцию или страницу приложения.

Пример:

```text
features/
├── auth/
├── dashboard/
├── users/
└── reports/
```

#### `features/auth/`

Раздел авторизации.

Может содержать:

- login page;
- registration page;
- password recovery;
- auth-specific services;
- auth routes.

#### `features/dashboard/`

Раздел главной панели или аналитики.

Может содержать:

- dashboard page;
- widgets;
- charts;
- summary cards;
- dashboard-specific logic.

#### `features/users/`

Раздел управления пользователями.

Может содержать:

- список пользователей;
- карточку пользователя;
- форму создания/редактирования;
- user-specific API services.

#### `features/reports/`

Раздел отчётов.

Может содержать:

- список отчётов;
- фильтры;
- экспорт;
- графики;
- report-specific services.

Рекомендуемый подход: каждая feature должна быть максимально изолированной и иметь собственные компоненты, маршруты, сервисы и состояние, если это необходимо.

---

### `layout/`

Компоненты общего каркаса приложения.

Пример структуры:

```text
layout/
├── header/
├── sidebar/
└── footer/
```

#### `layout/header/`

Верхняя часть приложения.

Может содержать:

- логотип;
- меню пользователя;
- переключатель языка;
- уведомления;
- кнопку выхода.

#### `layout/sidebar/`

Боковая навигация.

Может содержать:

- главное меню;
- ссылки на разделы;
- сворачивание/разворачивание меню;
- отображение пунктов по ролям.

#### `layout/footer/`

Нижняя часть приложения.

Может содержать:

- копирайт;
- ссылки;
- версию приложения.

---

### `store/`

Директория для управления состоянием приложения.

Может использоваться с NgRx, Signals Store или кастомным state management.

Пример структуры:

```text
store/
├── actions/
├── reducers/
├── effects/
└── selectors/
```

#### `store/actions/`

Actions описывают события, которые изменяют состояние приложения.

Примеры:

- загрузить пользователя;
- обновить профиль;
- получить список элементов;
- очистить состояние.

#### `store/reducers/`

Reducers отвечают за изменение состояния на основе actions.

#### `store/effects/`

Effects используются для побочных действий.

Примеры:

- API-запросы;
- навигация после успешного действия;
- сохранение данных в localStorage;
- обработка асинхронной логики.

#### `store/selectors/`

Selectors используются для получения данных из state.

Примеры:

- получить текущего пользователя;
- получить список элементов;
- получить статус загрузки;
- получить ошибку.

---

## Важные файлы приложения

### `app.routes.ts`

Файл маршрутизации приложения.

Содержит описание routes и lazy loading для feature-разделов.

Пример:

```ts
export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES),
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
  },
];
```

---

### `app.config.ts`

Главная конфигурация Angular-приложения.

Может содержать:

- providers;
- router configuration;
- HTTP client configuration;
- interceptors;
- глобальные настройки приложения.

Пример:

```ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
  ],
};
```

---

### `app.component.ts`

Корневой компонент приложения.

Обычно содержит основной layout и `<router-outlet />`.

Пример:

```html
<app-header />
<app-sidebar />
<main>
  <router-outlet />
</main>
<app-footer />
```

---

### `main.ts`

Точка входа Angular-приложения.

Запускает приложение через `bootstrapApplication`.

Пример:

```ts
bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
```

---

### `styles.scss`

Глобальные стили приложения.

Может содержать:

- CSS reset;
- глобальные переменные;
- базовую типографику;
- общие utility-классы;
- импорт дизайн-системы.

---

### `index.html`

Основной HTML-файл приложения.

Angular монтирует приложение в корневой элемент:

```html
<app-root></app-root>
```

---

### `angular.json`

Конфигурация Angular CLI.

Содержит настройки:

- build;
- serve;
- test;
- assets;
- styles;
- budgets;
- file replacements для окружений.

---

### `package.json`

Файл npm-проекта.

Содержит:

- scripts;
- dependencies;
- devDependencies;
- версию проекта;
- служебную информацию о пакете.

Пример команд:

```json
{
  "scripts": {
    "start": "ng serve",
    "build": "ng build",
    "test": "ng test",
    "lint": "ng lint"
  }
}
```

---

### `tsconfig.json`

Конфигурация TypeScript.

Определяет правила компиляции, strict mode, paths aliases и другие настройки.

---

### `.editorconfig`

Единые правила форматирования для редакторов кода.

Помогает поддерживать одинаковый стиль кода в команде.

---

### `.gitignore`

Список файлов и директорий, которые не должны попадать в Git.

Обычно включает:

```text
node_modules/
dist/
.angular/
.env
```

---

## Структура `assets`

### `assets/`

Статические файлы приложения.

Пример:

```text
assets/
├── images/
├── icons/
└── i18n/
```

#### `assets/images/`

Изображения приложения.

Примеры:

- логотипы;
- баннеры;
- фоновые изображения;
- иллюстрации.

#### `assets/icons/`

Иконки приложения.

Могут храниться в формате:

- SVG;
- PNG;
- icon sprites.

#### `assets/i18n/`

Файлы переводов.

Пример:

```text
i18n/
├── en.json
├── ru.json
└── de.json
```

---

## Структура `environments`

### `environments/`

Файлы конфигурации для разных окружений.

Пример:

```text
environments/
├── environment.ts
└── environment.prod.ts
```

#### `environment.ts`

Конфигурация для разработки.

Пример:

```ts
export const environment = {
  production: false,
  apiUrl: 'https://dev-api.example.com',
};
```

#### `environment.prod.ts`

Конфигурация для production-сборки.

Пример:

```ts
export const environment = {
  production: true,
  apiUrl: 'https://api.example.com',
};
```

---

## Рекомендации по организации кода

### 1. Разделять код по зонам ответственности

Не стоит хранить всю логику в одной папке `components/`. Лучше разделять приложение на `core`, `shared`, `features`, `layout` и `store`.

### 2. Использовать lazy loading для feature-разделов

Функциональные разделы лучше загружать лениво. Это уменьшает размер начального bundle и ускоряет старт приложения.

### 3. Не смешивать `core` и `shared`

`core` — это глобальная логика приложения.

`shared` — это переиспользуемые UI-элементы, pipes, directives и helpers.

### 4. Держать feature-модули изолированными

Каждая feature должна содержать всё, что относится к её бизнес-логике.

Пример:

```text
features/users/
├── components/
├── pages/
├── services/
├── models/
├── users.routes.ts
└── users.store.ts
```

### 5. Использовать standalone components

Для современных Angular-приложений рекомендуется использовать standalone components и route-level code splitting.

### 6. Выносить бизнес-логику из компонентов

Компоненты должны отвечать в первую очередь за отображение и пользовательские события.

Бизнес-логику лучше хранить в:

- services;
- facades;
- stores;
- effects;
- utility functions.

### 7. Использовать понятные нейминги

Примеры:

```text
user-card.component.ts
user-form.component.ts
users-page.component.ts
users.service.ts
users.store.ts
auth.guard.ts
auth.interceptor.ts
```

---

## Пример структуры feature-раздела

```text
features/users/
├── components/
│   ├── user-card/
│   │   ├── user-card.component.ts
│   │   ├── user-card.component.html
│   │   └── user-card.component.scss
│   │
│   └── user-form/
│       ├── user-form.component.ts
│       ├── user-form.component.html
│       └── user-form.component.scss
│
├── pages/
│   ├── users-list-page/
│   └── user-details-page/
│
├── services/
│   └── users-api.service.ts
│
├── models/
│   └── user.model.ts
│
├── users.routes.ts
└── users.store.ts
```

Такой подход помогает держать код feature-раздела рядом и упрощает поддержку проекта.

---

## Преимущества такой структуры

- Улучшает масштабируемость приложения.
- Упрощает командную разработку.
- Делает код более понятным и предсказуемым.
- Ускоряет разработку новых функциональных разделов.
- Упрощает поддержку и рефакторинг.
- Помогает использовать lazy loading и code splitting.
- Подходит для средних и крупных Angular-приложений.

---

## Быстрый старт

Установка зависимостей:

```bash
npm install
```

Запуск проекта локально:

```bash
npm start
```

Production-сборка:

```bash
npm run build
```

Запуск тестов:

```bash
npm test
```

---

## Итог

Такая структура помогает сохранить проект организованным, модульным, масштабируемым и удобным для поддержки. Она хорошо подходит для Angular-приложений, которые будут развиваться, расширяться и поддерживаться командой разработчиков.
