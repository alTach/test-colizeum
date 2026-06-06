---

# 📘 Code Style Guide — Angular Project

**Сборник правил (v1.0)**
Структурированный и расширяемый документ, каждый пункт — со своим номером.

Формат полностью готов для использования в README.md.

---

# 📑 Содержание

<details>
<summary><strong>1. Общие принципы</strong></summary>

#### **1.1. Ясность важнее хитроумности**

Код должен быть предельно читаемым и очевидным.

#### **1.2. Согласованность**

Придерживайтесь единых подходов и паттернов, существующих в проекте.

#### **1.3. Производительность без преждевременной оптимизации**

Оптимизируем только то, что доказано медленно.

#### **1.4. Доступность (A11y)**

Используем семантический HTML, aria-атрибуты и тестирование доступности.

#### **1.5. Стандарты кодирования, форматирование и коммиты**

* Используем ESLint с конфигурацией Airbnb для единых правил кодирования.
* Используем Prettier для автоматического форматирования кода.
* Настраиваем Husky для проверки кода и автоматического форматирования перед коммитом, чтобы каждый коммит содержал чистый и стандартизированный код.
поэтому код необходимо генерировать сразу в отформатированном стиле

#### 1.5.1 Порядок расположения методов, переменных и импортов в Angular

#### **Общие принципы**

* Методы в компонентах и сервисах должны располагаться в порядке жизненного цикла Angular: сначала `constructor`, затем методы инициализации (`ngOnInit`, `ngAfterViewInit` и т.д.), а в конце — методы очистки (`ngOnDestroy`)
* Внутри компонента сначала идут `inject`-ы (службы и зависимости), затем переменные, после них методы жизненного цикла, а затем все дополнительные методы, специфичные для компонента.

#### ❌ Плохо

```ts
@Component({
  selector: 'app-sample',
  imports: [CommonModule],
  templateUrl: './sample.component.html',
})
export class SampleComponent {
  dataService = inject(DataService);

  ngOnInit() {
    this.loadData();
  }

  constructor(private logger: LoggerService) {}

  ngOnDestroy() {
    this.cleanup();
  }

  loadData() {
    // ...
  }
}
```

#### ✅ Хорошо

```ts
@Component({
  selector: 'app-sample',
  templateUrl: './sample.component.html',
  styleUrls: ['./sample.component.scss'],
  imports: [CommonModule], // в самом конце декоратора
})
export class SampleComponent {
  // Сначала inject
  private dataService = inject(DataService);
  private logger = inject(LoggerService);

  // Затем переменные
  public items: Item[] = [];

  ngOnInit(): void {
    this.loadData();
  }

  ngAfterViewInit(): void {
    this.setupView();
  }

  ngOnDestroy(): void {
    this.cleanup();
  }

  // Дополнительные методы
  private loadData(): void {
    // ...
  }

  private setupView(): void {
    // ...
  }

  private cleanup(): void {
    // ...
  }
}
```

✅ **Пояснение:**

* Такой порядок облегчает чтение и поддержку кода, сразу видно, какие зависимости инжектятся, какие переменные используются, как работает жизненный цикл и где находятся вспомогательные методы.
* Правило распространяется как на компоненты, так и на сервисы, где методы тоже желательно упорядочивать по логике вызова.


#### **1.6. Документируй всё что создаёшь: переменные; типы и его поля; константы; сервисы (предназначение)**



</details>

---

<details>
<summary><strong>2. Angular</strong></summary>

### 2.1. Именование

2.1.1 Все компоненты должны оканчиваться на `component`, сервисы на `service`, гарды на `guard` и так далее

### 2.2. Структура

Шаблон и стили в отдельных файлах, но если объём символов менее 200, то можно заинлайнить, но не более 6 строк после форматирования.
Типы должны лежать в отдельном файле (например trahs)

### 2.3. Префикс селектора

Используем префикс из angular.json.

### 2.4. Standalone Components

NgModules — только если невозможно обойтись без них, а вместо импорта CommonModule стоит импортировать только то что необходимо.

### 2.5. Signals

Используйте `signal()`, `computed()` и `effect()` для реактивного обновления UI, но избегайте избыточного использования там, где реактивность не требуется.

### 2.6. Input/Output
Всегда используйте `input()` и `output()` вместо декораторов.

#### 2.6.1. именование input/output 
не называй input как title, потому что помимо передачи параметра он добавляет title в html

### 2.7. Change Detection

Устанавливаем `OnPush` для всех компонентов.

### 2.8. Lazy Loading

Все feature-модули загружаются лениво.

### 2.9. Формы
#### 2.9.1 Используем реактивные формы (Reactive Forms).
#### 2.9.2 Все формы должны быть типизированными

### 2.10. Стили

TailwindCSS — по умолчанию, SCSS — только для edge–кейсов. Использование tailwind не исключает добавление стилей в scss. 
Если есть 2 связанных между собой блока и они используют одинаковые стили то необходимо создать связь между ними, например общий класс, а стили в scss. Что бы была 1 точка входа для применения изменений.

#### 2.10.1. CSS-переменные (`var(--)`) vs SCSS-переменные (`$var`)

CSS-переменные (`--var`) разрешены **только** в следующих случаях:
- Переменная должна быть **переопределена в runtime** — например, при переключении тем (`[data-theme="dark"]`), изменении состояния компонента или другом динамическом поведении.
- Используется **сторонняя библиотека**, которая предоставляет механику переопределения стилей через CSS-переменные (т.е. разработчик библиотеки заложил такую точку расширения).

Во всех остальных случаях — **использовать только SCSS-переменные** (`$var`). CSS-переменные не должны применяться как удобная замена SCSS-переменным для статических значений.

### 2.12. Сервисы-компонентов

Если сервис используется только одним компонентом — импортируем через декоратор компонента.

### 2.13. Pipes

Для преобразований в шаблоне используем Pipes, а не методы компонентов или signal(-ы)
В большинстве случаев вместо let лучше использовать pipe.


#### ❌ Плохо (используется signal вместо pipe)
```ts
readonly events = input.required<Event[]>();
readonly maxItems = input<number>(5);

readonly displayedEvents = computed(() => {
    return this.events().slice(0, this.maxItems());
});

@for (event of displayedEvents(); track event.id){
  ...
}
```

#### ✅ Хорошо (лучше просто использовать pipe)
```html
@for (event of events() | transformToBlaBlaBla; track event.id){
...
}
```


#### ❌ Плохо (тернарное условие, вместо использования пайпа)
```ts
<span class="px-2 py-1 rounded text-sm border border-gray-300">
  {{
  caseData()!.case_type === 'criminal' ? 'Уголовное' : caseData()!.case_type === 'civil' ? 'Гражданское' : 'Административное'
}}
</span>
```

#### ✅ Хорошо (pipe скрываю всю необходимую логику)
```html
<span class="px-2 py-1 rounded text-sm border border-gray-300">
 {{ caseData()!.case_type | caseType}}
</span>
```
caseData()!.case_type === 'criminal' ? 'Уголовное' :
caseData()!.case_type === 'civil' ? 'Гражданское' : 'Административное'

#### ❌ Плохо (трансформация через computed вместо pipe)
```ts
readonly initials = computed(() =>
  `${this.contact().lastName.slice(0, 1)}${this.contact().firstName.slice(0, 1)}`.toUpperCase()
);
```
```html
<span>{{ initials() }}</span>
```

#### ✅ Хорошо (pipe инкапсулирует трансформацию)
```ts
// initials.pipe.ts
@Pipe({ name: 'initials', standalone: true })
export class InitialsPipe implements PipeTransform {
  transform(contact: { firstName: string; lastName: string }): string {
    return `${contact.lastName.slice(0, 1)}${contact.firstName.slice(0, 1)}`.toUpperCase();
  }
}
```
```html
<span>{{ contact() | initials }}</span>
```

### 2.14. Разделение компонентов и использование «глупых» компонентов

#### **Общие принципы**

* Компоненты не должны быть слишком большими — если компонент выполняет несколько разных функций или содержит длинный шаблон, его части нужно выделять в отдельные подкомпоненты.
* Общие элементы (подложка, карточка с заголовком, кнопка, список и т.д.) следует оформлять как отдельные компоненты со входящими параметрами (`@Input`), которые занимаются только отображением и инкапсулируют минимальную логику.
* Использовать Angular сущности по назначению: компоненты, директивы, пайпы.
* Для повторяющихся или обособленных частей шаблона использовать проекцию контента (`ng-content`).
* Если шаблон маленький и прост, можно обойтись без отдельного компонента, используя `TemplateRef` и `ngTemplateOutlet`.
* Все визуальные «глупые» компоненты должны быть независимыми, с минимальной логикой, чтобы их можно было переиспользовать и тестировать отдельно.

#### ❌ Плохо
```ts
@Component({
  selector: 'app-dashboard',
  template: `
    <div class="card">
      <h2>{{ title }}</h2>
      <p>{{ description }}</p>
      <button (click)="doAction()">Click</button>
    </div>
    <div class="card">
      <h2>{{ anotherTitle }}</h2>
      <p>{{ anotherDescription }}</p>
      <button (click)="doAnotherAction()">Click</button>
    </div>
  `,
})
export class DashboardComponent {
  title = 'Card 1';
  description = 'Description 1';
  anotherTitle = 'Card 2';
  anotherDescription = 'Description 2';

  doAction() { ... }
  doAnotherAction() { ... }
}
```

#### ✅ Хорошо
```ts
// card.component.ts — глупый компонент
@Component({
  selector: 'app-card',
  template: `
    <div class="card">
      <h2>{{ title }}</h2>
      <p>{{ description }}</p>
      <ng-content></ng-content> <!-- проекция для кнопок или дополнительного контента -->
    </div>
  `,
})
export class CardComponent {
  @Input() title!: string;
  @Input() description!: string;
}

// dashboard.component.ts — «умный» компонент, использующий глупые компоненты
@Component({
  selector: 'app-dashboard',
  template: `
    <app-card *ngFor="let card of cards" [title]="card.title" [description]="card.description">
      <button (click)="card.action()">Click</button>
    </app-card>
  `,
})
export class DashboardComponent {
  cards = [
    { title: 'Card 1', description: 'Description 1', action: () => this.doAction() },
    { title: 'Card 2', description: 'Description 2', action: () => this.doAnotherAction() },
  ];

  doAction() { ... }
  doAnotherAction() { ... }
}
```

✅ **Пояснение:**

* Компоненты маленькие и переиспользуемые.
* Логика действия остаётся в «умном» компоненте, визуальная часть — в «глупом».
* Используется проекция контента через `ng-content`.
* Можно создавать шаблоны через `TemplateRef` для простых вставок, не создавая отдельный компонент.

### 2.15. Избегаем использование функций в шаблоне
Функции в шаблоне пересчитывается при повторном запуске механизма поиска изменений, вместо этого лучше использовать signal, computed или pipe.
Но это не относиться к обработчикам типа click или output и другие, которые выполняются при наступлении определённых событий


#### ❌ Плохо
```html
 @let icon = getEventIcon(event);
 <z-icon [zType]="icon"></z-icon>
```


#### ✅ Хорошо
```hmtl
  <z-icon [zType]="event | eventType"></z-icon>
```

#### ❌ Плохо
```html
 {{ Math.abs(computedDate().daysLeft || 0) }} дн - {{computedDate().isOverdue ? 'просрочен' : 'осталось'}}
```

#### ✅ Хорошо
```hmtl
  computedDate() | dateComment
```

#### ❌ Плохо
```ts
getStatusClass(status: string): string {
  const map: Record<string, string> = {
    active: 'bg-green-100 text-green-800 border-green-200',
    suspended: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    closed: 'bg-gray-100 text-gray-800 border-gray-200',
  };
  return map[status] || 'bg-gray-100 text-gray-800';
}

getStatusLabel(status: string): string {
  const map: Record<string, string> = {
    active: 'Активное',
    suspended: 'Приостановлено',
    closed: 'Закрыто',
  };
  return map[status] || status;
}
```
```html
 <span class="text-xs px-2 py-0.5 rounded-full border" [class]="getStatusClass(caseItem.status)">
   {{ getStatusLabel(caseItem.status) }}
 </span>
```

#### ✅ Хорошо
```hmtl
  <span class="text-xs px-2 py-0.5 rounded-full border" [class]="caseItem.status | blaBlaClass"> // используется pipe
   {{ caseItem.status | blabalLabel }} // используется pipe
 </span>
```

</details>

---

<details>
<summary><strong>3. RxJS</strong></summary>

### 3.1. Управление подписками

Подписался, отпишись! Используем `takeUntilDestroyed()`, не забудь импортировать DestroyRef.

```typescript
  private
destroyRef = inject(DestroyRef);
.....
pipt(takeUntilDestroyed(this.destroyRef)).subscriber(() => {...
})
```

</details>

---

<details>
<summary><strong>4. Архитектура и абстракция</strong></summary>

### 4.1. Абстракция браузерных API

Никаких прямых вызовов `window`, `document`, `localStorage`, вместо этого абстракция, можно использовать @ng-web-apis

#### ❌ Плохо

```ts
window.localStorage.getItem('token');
```

#### ✅ Хорошо

```ts
storageService.get('token');
```

### 4.1.1 Компонент должен зависеть от астракции, а не от конкретной реализации

### 4.2. Внутри приложения использовать только свои данные
UI не должен работать с данные которые пришли с сервера, он должен работать со своим типом. Поэтому все данные с сервера перекладываются (копировать не надо достаточно присвоить) в локальные и создаются FE типы

### 4.3. Минимализм и trash концепция 

#### 4.3.1 Всё что можно импортировать нужно импортировать, придерживаемся декларативного стиля написания кода, всё что можно заменить и вынести выносим для того что бы код чистался удобно для человека как музыкальное произведение. Сложные вещи оборачиваем в именованные сущености и переиспользуем. Повсеместно используем чистые функции. А место хранения для всей это дичи это папка trash.

#### ❌ Плохо
```ts
this.filterForm.valueChanges
  .pipe(
    takeUntil(this.destroy$),
    distinctUntilChanged((prev, curr) => {
      // Игнорируем изменения только в поле search
      return prev.type === curr.type &&
        prev.caseId === curr.caseId &&
        prev.dateFrom === curr.dateFrom &&
        prev.dateTo === curr.dateTo;
    })
  )
  .subscribe(() => {
    this.emitFilterChange();
  });
```

#### ✅ Хорошо
```ts
this.filterForm.valueChanges
  .pipe(
    takeUntil(this.destroy$),
    distinctUntilChanged(skipSearchUpdatesInEventsFilter)
  )
  .subscribe(() => {
    this.emitFilterChange();
  });
```

4.3.2 Статические и переиспользуемые данные должны быть вынесены в файл

Если данные являются:

* статическими
* переиспользуемыми
* неизменяемыми
* картами соответствий (словари и т.д.)
* большими массивами или объектами
* чистые функции

→ они **обязаны** быть вынесены в отдельный именованный файл в папку **`trash/`**
и импортированы в компонент как константа.

### ❌ Плохой код

```typescript
eventIcons: { [key: string]: string } = {
  detention: 'AlertCircle',
  interrogation: 'MessageSquare',
  search: 'AlertCircle',
};
```

### ✅ Хороший код

`trash/event-icons.const.ts`

```ts
export const EVENT_ICONS = {
  detention: 'AlertCircle',
  interrogation: 'MessageSquare',
  search: 'AlertCircle',
};

// потом переиспользуем
eventIcons = EVENT_ICONS;
```

### ❌ Плохо

Типы объявлены прямо в компоненте:

```ts
interface Event {
  ...
}

@Component(...)
export class DashboardComponent {
  ...
}
```

### ✅ Хорошо

```ts
import { EventModel } from 'trash/types/event.model';

@Component(...)
export class DashboardComponent {
...
}
```

### ❌ Плохо

Мап декларируется в компоненте

```ts

@Component(...)
export class SomeComponent {
  ...

  priorities = [
    { value: PriorityEnum.LOW, label: 'Низкий' },
    { value: PriorityEnum.MEDIUM, label: 'Средний' },
    { value: PriorityEnum.HIGH, label: 'Высокий' },
    { value: PriorityEnum.URGENT, label: 'Срочный' },
  ];
}
```

### ✅ Хорошо
Несмотря на то что этот словарь используется исключительно в этом компоненте его надо выносить в отдельный файл trash и переиспользовать что бы он не бросался в глаза, не занимал место и отнимал фокусное внимание

```ts
import { SOME_PRIORITIES } from 'trash/some-priorities';

@Component(...)
export class SomeComponent {
...
  priorities = SOME_PRIORITIES
}
```

### 4.4 Сетевой слой
При работе с сетевым слоем нужно создать папку дата
1. создать папку дата и положить в него data.module
2. у каждого сервиса будет своя отдельная папка которая будет содержать соответствующие файлы
```
data
--agencies
--cases
--contacts
--events
...
--data.module.ts
```
3. внутри каждой папки будет файл с названием provider, который соедржит токен с помощью которого будет провайдиться объязательно с использование factory
```ts
[events.provider.ts]

export const BENEFITS_SERVICE = new InjectionToken<BenefitInterface>('BenefitsInterface');

export const BENEFITS_SERVICE_PROVIDER = {
  provide: BENEFITS_SERVICE,
  useClass: BenefitService
}
```
4. затем


</details>

---

<details>
<summary><strong>5. TypeScript</strong></summary>

####  5.2 Правило: Использование именованных констант вместо магических значений
Всегда заменяй магические строки, числа и значения на именованные константы с семантически понятными названиями. Каждое значение должно иметь явное назначение.

### Когда создавать именованные константы:
- ✅ Коды законов, нормативных актов
- ✅ Статусы, типы, категории
- ✅ Ключи API, коды ошибок
- ✅ ID элементов, конфигурационные значения

**Помни: Если значение требует комментария, чтобы быть понятым - оно должно быть вынесено в именованную константу!**

## ❌ Плохой код (Магические значения)

```typescript
// ПЛОХО - что такое '59fz'?!
if (deadlineType === '59fz') {
  this.calculateFederalDeadline();
}

// Ещё хуже - разбросано по коду
switch (lawType) {
  case '44fz': return 10;
  case '223fz': return 15;
  case '59fz': return 30; // Что это?!
}
```

## ✅ Хороший код (Именованные константы)

### 1. Создание констант с понятными именами
```typescript
// laws.constants.ts
export const LAWS = {
  FEDERAL_PROCUREMENT: '44fz',
  CORPORATE_PROCUREMENT: '223fz', 
  FEDERAL_APPEAL: '59fz' // Закон о порядке рассмотрения обращений граждан
} as const;

export type LawType = typeof LAWS[keyof typeof LAWS];
```

### 2. Использование в коде
```typescript
// Теперь понятно что проверяем
if (deadlineType === LAWS.FEDERAL_APPEAL) {
  this.calculateFederalAppealDeadline();
}

// Читаемый switch
switch (lawType) {
  case LAWS.FEDERAL_PROCUREMENT: return 10;
  case LAWS.CORPORATE_PROCUREMENT: return 15;
  case LAWS.FEDERAL_APPEAL: return 30;
}
```

### 3. Придумай префикс 1 буква и всем типам во фронтенд проекта задавай этот префикс, далее обогащай постфиксами при необходимости что бы не столкнуться с колизиями.


### 5.1. Строгая типизация

Строгие правила tsconfig.

### 5.2. Readonly и as const

Используем для всех неизменяемых полей, для статических переменных используй as const

### 5.3. Строгая типизация, всего

5.3.1 мап–объектов
Нельзя `{ [key: string]: string }`.

#### ❌ Плохо

```ts
priorityClass: {[key:string]:string} = {...}
```

#### ✅ Хорошо

```ts
priorityClass: Record<Case['priority'], string> = {...};
```

5.3.2 типизация строк-значений (ограниченных множеств)**

Строковые типы нельзя указывать как `string`, если значение принимает **ограниченное множество заранее известных строк**.

* **проверять**, где используется строковое значение
* **определять**, ограничено ли оно набором вариантов
* **никогда не писать `string`, если возможен точный тип**
* при невозможности определить набор → **документировать связь через JSDoc**

---

### ❌ Плохо

```ts
export interface StatModel {
  title: string;
  value: number;
  icon: string; // слишком общий тип
  color: string; // непонятно, какие цвета
}
```

```html
<lucide-icon [name]="stat.icon"></lucide-icon>
```

---

### ✅ Хорошо (строгий литеральный тип)

```ts
export type LucideIconName = 
  | 'AlertCircle'
  | 'MessageSquare'
  | 'Calendar'
  | 'FileText';
```

```ts
export interface StatModel {
  title: string;
  value: number;
  icon: LucideIconName;
  color: StatColor;
}
```

---

### ✅ Хорошо (много значений → тип через массив)

```ts
export const LUCIDE_ICON_NAMES = [
  'AlertCircle',
  'MessageSquare',
  'Calendar',
  'FileText',
] as const;

export type LucideIconName = (typeof LUCIDE_ICON_NAMES)[number];
```

---

### ✅ Хорошо (значений слишком много → через JSDoc)

```ts
/**
 * Названия иконок соответствуют списку name в `<lucide-icon>`.
 * См. документацию: https://lucide.dev/icons/
 */
export type LucideIconName = string; // пока fallback
```


5.3.3 Типизируем Route Data и Query Parameters, потому что есть связь.

## ❌ Плохой код (Строковые литералы)
```typescript
// ПЛОХО - строковые литералы!
this.route.snapshot.data['user']; // какой тип принимает data?
this.route.snapshot.data['permissions'];
this.route.snapshot.queryParamMap.get('page'); // какие строки можно передавать для получчения q параметров?
this.route.snapshot.queryParamMap.get('search');
this.router.navigate(['/applications/create', {queryParams: {sort}}]);

export const appRoutes: Routes = [{
  path: 'applications/create',
  component: ApplicationDetailPageComponent,
  data: {
    name: 'Создать заявление'
  } // из чего состоит data?
}]
```

## ✅ Хороший код (Полная типизация)

### 1. Определяем типы
```typescript
// types/route.types.ts
export interface ApplicationRouteData {
  user: User;
  permissions: string[];
  pageConfig: PageConfig;
}

export interface ApplicationQueryParams {
  page: string;
  sort: 'asc' | 'desc';
  filter: string;
  search: string;
  category: string;
}

(this.route.snapshot.data as ApplicationRouteData).user
(this.route.snapshot.data as ApplicationRouteData).permissions
(this.route.snapshot.queryParams as ApplicationQueryParams).page
(this.route.snapshot.queryParams as ApplicationQueryParams).search
this.router.navigate(['/applications/create', {queryParams: {sort} as ApplicationQueryParams}]);

export const appRoutes: Routes = [{
  path: 'applications/create',
  component: ApplicationDetailPageComponent,
  data: {
  name: 'Создать заявление'
 } as ApplicationPageData
}]
```
другой пример

## ❌ Плохой код (тип строка)
```typescript
readonly typeFilter = signal('all');

<z-select [zValue]="typeFilter()" (onValueChange)="typeFilter.set($event)">
          <z-select-item zValue="phone_call">Звонок</z-select-item>
          <z-select-item zValue="meeting">Встреча</z-select-item>
          <z-select-item zValue="court_hearing">Судебное заседание</z-select-item>
          <z-select-item zValue="document_creation">Создание документа</z-select-item>
          <z-select-item zValue="task">Задача</z-select-item>
          <z-select-item zValue="other">Другое</z-select-item>
        </z-select>
```

## ✅ Хороший код
```typescript
export const EventType = {
  all: {value: 'all', name: 'Все типы', order: 0},
  phone_call: {value: 'phone_call', name: 'Звонок', order: 1},
  meeting: {value: 'meeting', name: 'Встреча', order: 2},
  court_hearing: {value: 'court_hearing', name: 'Судебное заседание', order: 3},
  document_creation: {value: 'document_creation', name: 'Создание документа', order: 4},
  task: {value: 'task', name: 'Задача', order: 5},
  other: {value: 'other', name: 'Другое', order: 6},
}
readonly typeFilter = signal<EventTypeEnum>(EventType.all.value);
public readonly eventType = EventType

<z-select [zValue]="typeFilter()" (onValueChange)="typeFilter.set($event)">
  @for (item of eventType | eventsToArray; track item.order) {
    <z-select-item [zValue]="item.value">{{EventType.name}}</z-select-item>
  }
</z-select>
```



---

### 5.3.4 Generic-интерфейсы с литеральным ключом

Если интерфейс используется в нескольких контекстах с разными наборами ключей — делай его generic. Это позволяет сквозной типизации течь через pipe → component input → output → метод.

## ❌ Плохо

```ts
// key: string — теряем информацию о допустимых значениях
export interface FilterPill {
  key: string;
  label: string;
}

// output и метод принимают что угодно
readonly remove = output<string>();
removeFilter(key: string): void { ... }
```

## ✅ Хорошо

```ts
// 1. Определяем конкретные ключи рядом с моделью фильтра
export type ApplicationFilterKey = 'search' | 'status' | 'agency' | 'date' | 'deadline';

// 2. Интерфейс generic — K выводится из контекста использования
export interface FilterPill<K extends string = string> {
  key: K;
  label: string;
}

// 3. Pipe возвращает конкретный тип
@Pipe({ name: 'applicationFilterPills' })
export class ApplicationFilterPillsPipe implements PipeTransform {
  transform(filters: ApplicationsFilterModel | null): FilterPill<ApplicationFilterKey>[] { ... }
}

// 4. Компонент generic — K выводится из переданного pills input
@Component({ ... })
export class FilterActivePillsComponent<K extends string> {
  readonly pills = input<FilterPill<K>[]>([]);
  readonly remove = output<K>();  // ← типизирован, а не string
}

// 5. Метод принимает конкретный тип
removeFilter(key: ApplicationFilterKey): void { ... }
```

Angular выводит `K = ApplicationFilterKey` из типа pipe, поэтому `$event` в `(remove)="removeFilter($event)"` строго типизирован.

---

## 🎯 Преимущества полной типизации

- **Единая точка правки** - меняем тип, обновляется везде
- **Автодополнение** - IDE подсказывает доступные поля
- **Защита от опечаток** - `data['usar']` → ошибка компиляции
- **Предсказуемость** - знаем какие параметры ожидать
- **Легкий рефакторинг** - меняем названия параметров в одном месте

**Правило: Всегда типизируйте и route data и query parameters через интерфейсы!**



---

### 5.4. Явное указание типов для переменных и возвращаемых значений функций

Аналогично, все функции и методы должны иметь явно указанное возвращаемое значение, особенно если оно влияет на логику или типизацию в дальнейшем.

#### ❌ Плохо

```ts
statsList = signal([]); // Тип неизвестен, TS выводит any[]
this.statsList.set(await this.dashboardService.getStats()); // getStats возвращает массив, тип не указан

function getStats() {
  return fetchStats(); // возвращает массив, тип не указан
}
```

#### ✅ Хорошо

```ts
statsList = signal<StatModel[]>([]); // дополнительно указывать тип для переменной необъязательно пототму что она будет присвоена автоматически
this.statsList.set(await this.dashboardService.getStats());

function getStats(): StatModel[] {
  return fetchStats();
}
```

####  5.5 Создание промежуточных псевдонимов типов
Всегда создавай промежуточный псевдоним типа для сложных TypeScript выражений, если они используются более одного раза или Содержит > 2 уровней вложенности

// ❌ Многоуровневая вложенность
const form: FormGroup<FormValue<ApplicationsFilterModel>> = ...;

// ✅ С псевдонимом
type ApplicationsFilterForm = FormValue<ApplicationsFilterModel>;
const form: FormGroup<ApplicationsFilterForm> = ...;

</details>

---

<details>
<summary><strong>6. Git соглашения</strong></summary>

### 6.1. Conventional Commits ([link1](https://www.conventionalcommits.org/en/v1.0.0-beta.4/), [link2](https://www.conventionalcommits.org))

`feat:`, `fix:`, `refactor:`, `chore:`

### 6.2. Именование веток

`feature/add-profile`, `bugfix/fix-auth`

</details>

---

<details>
<summary><strong>6. Стандартизированное восстановление параметров</strong></summary>

```ts
      {
  path: 'applications/create',
    loadComponent: () => import('./page.component').then(m => m.PageComponent),
    data: {
      name: 'Создать заявление',
    } as ApplicationPageDataDTO,
    resolve: {
      data: applicationCreateResolver,
    } as Resolver,
},
```

</details>

<details>
<summary><strong>7. Правила именования типов, интерфейсов и переменных (во избежание коллизий)</strong></summary>

### 7.1. Все типы и интерфейсы должны иметь обязательные суффиксы

Чтобы исключить конфликты и пересечения имён (например: `User`, `Event`, `Case`), каждый тип должен иметь понятный и уникальный **семантический суффикс**, отражающий его назначение.

### 📌 Обязательные суффиксы

| Категория                          | Суффикс  | Пример                                 |
|------------------------------------|----------|----------------------------------------|
| Интерфейсы данных                  | `Model`  | `UserModel`, `EventModel`, `CaseModel` |
| Типы маппингов / словарей          | `Map`    | `EventIconMap`, `UserPermissionMap`    |
| DTO (структуры API)                | `Dto`    | `UserDto`, `CaseDto`                   |
| Типы для UI                        | `Ui`     | `UserUi`, `EventUi`                    |
| Типы конфигурации                  | `Config` | `TableConfig`, `ModalConfig`           |
| Енамы                              | `Enum`   | `UserRoleEnum`, `CaseStatusEnum`       |
| Универсальные вспомогательные типы | `Type`   | `PaginationType`, `SortType`           |

### ❌ Плохой пример

```ts
interface User {
  ...
}

type Event = string;
```

### ✅ Хороший пример

```ts
interface UserModel {
  ...
}

type EventModel = string;
```

### 7.2 Именование базовых сущностей
1. Всё что возвращает сервер должно возвращаться с суффисом Res(UserRes) а всё что отправляется на сервер Req(UserReq)
2. Тип формы всегда должен заканчиваться суффисом Form (UserForm)
3. Все остальные фронтовые типы суффикс FE
4. Даже есть значения сущностей совпадают, они должны иметь разное окончание. (например значение формы совпадает с тем что мы отправляем, не смотря на это у нас должно быть 2 разных типа)

### 7.3. Переменные на основе типов должны использовать сглаженные суффиксы

Переменные, которые используют модели или перечисления, должны иметь предсказуемые суффиксы, чтобы было понятно, к чему они относятся:

### 📌 Рекомендации

| Переменная        | Суффикс   | Пример                             |
|-------------------|-----------|------------------------------------|
| Экземпляр модели  | `Model`   | `user: UserModel`                  |
| Мапы / словари    | `Map`     | `caseStatusMap: CaseStatusEnumMap` |
| UI-состояние      | `Ui`      | `userUi: UserUi`                   |
| Данные API        | `Res/Req` | `pld: CaseReq`, `data: CaseRes`    |
| Данные FE         | `FE`      | `payload: UpdateCaseFE`            |

### ❌ Плохо

```ts
const user: UserModel;
```

### ✅ Хорошо

```ts
const userModel: UserModel;
```

### 7.4. Соглашение: одно слово — не тип

Имена типа **не могут состоять из одного слова**, если это слово слишком распространено:

❌ Нельзя:

* `User`
* `Event`
* `Case`
* `Info`
* `Data`
* `Payload`
* `Response`

Это приводит к коллизиям, особенно в крупных проектах.

✅ Нужно:

* `UserModel`
* `UserDto`
* `EventModel`
* `CaseDto`
* `BaseResponseDto`

### 7.5. Глобальные (shared) типы должны иметь префиксы

Если тип используется в нескольких доменах приложения, он должен иметь префикс по домену:

| Домен          | Префикс | Пример                             |
|----------------|---------|------------------------------------|
| Пользователи   | `User`  | `UserProfileModel`, `UserRoleEnum` |
| Документы      | `Doc`   | `DocMetaModel`, `DocTypeEnum`      |
| События        | `Event` | `EventIconMap`, `EventStatusEnum`  |
| Материалы дела | `Case`  | `CaseModel`, `CaseDto`             |


Ниже привожу **обновлённое правило**, полностью согласующееся с твоими пожеланиями:

### 7.6. Правила именования констант

Константы должны быть оформлены строго в формате: 📌 **UPPER_SNAKE_CASE**  
✔ Это делает константы визуально отличимыми от переменных, типов и интерфейсов.

### ❌ Плохие примеры

```ts
const eventIcons = {...}
const userRoles = {...}
const DefaultConfig = {...}
```

### ✅ Хорошие примеры

```ts
export const EVENT_ICONS = {...};
export const USER_ROLES_MAP = {...};
export const DEFAULT_CONFIG = {...};
```

### ⛔ Запрещено:

* объявлять константы внутри компонентов
* создавать односложные константы без контекста (`DATA`, `INFO`, `MAP`)
* смешивать разные категории данных в одном файле

### 7.8. Инкапсуляция блока если можно обозвать
Если есть блок кода которая выполняет определённую логику и её можно обозвать, то такой блок кода надо оборачивать в метод, функцию и т.д. Например подписка, много pipe-во условий и прочее.
и выносить в соответствующую папку или мусорную папку(trash)

### ✅ Хорошо

```ts
import { EventModel } from 'trash/types/event.model';

@Component(...)
export class DashboardComponent {
...
}
```

### ❌ Плохо

Мап декларируется в компоненте

Константа объявлена внутри компонента, должна быть в папке trash
```ts
const INDICATOR_CLASSES = [
  'absolute', 'top-2', 'right-2',
  'w-1.5', 'h-1.5',
  'bg-yellow-400', 'rounded-full',
  'z-10', 'pointer-events-none', 'shadow-sm'
];

@Directive({}) SomeDirective {....}
```

### 7.9

</details>
---

<details>
<summary><strong>9 Документация</strong></summary>

Если данные сложные — обязательна JSdoc документация, а если это строка, то объязательно прописывай пример
```typescript
{
  /**
   * @example '12.13.20224'
   */
  submission_date?: string; 
}
```
</details>



---
10. Общие правила, примеры хорошего и плохого кода

### 10.1 Дублирование DRY (Don't Repeat Yourself)

## 📋 Основной принцип
Избегайте любого дублирования кода и создавайте явные связи между связанными элементами. Каждая сущность должна иметь единую точку входа для изменений.

Пример 1
## ❌ Плохой код (Дублирование)

```html
<thead class="bg-gray-50">
  <tr>
    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
      Название
    </th>
    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
      Ведомство
    </th>
    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
      Статус
    </th>
    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
      Дата подачи
    </th>
    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
      Срок ответа
    </th>
  </tr>
</thead>
```

**Проблемы:**
- Дублирование одинаковых классов в каждом `<th>`
- 5 точек входа для изменений стилей
- Сложность поддержки

## ✅ Хороший код (Единая точка входа)

### Способ 1: Общий CSS класс (Рекомендуется)
```html
<thead class="bg-gray-50">
  <tr>
    <th scope="col" class="table-header">Название</th>
    <th scope="col" class="table-header">Ведомство</th>
    <th scope="col" class="table-header">Статус</th>
    <th scope="col" class="table-header">Дата подачи</th>
    <th scope="col" class="table-header">Срок ответа</th>
  </tr>
</thead>
```

```css
.table-header {
  @apply px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider;
}
```

### Способ 2: Angular Template
```html
<!-- Использование компонента -->
<thead class="bg-gray-50">
  <tr>
    <ng-container ngTemplateOutlet="TableHead; context: {$implicit: 'Название'}"></ng-container>
    <ng-container ngTemplateOutlet="TableHead; context: {$implicit: 'Ведомство'}"></ng-container>
    <ng-container ngTemplateOutlet="TableHead; context: {$implicit: 'Статус'}"></ng-container>
    <ng-container ngTemplateOutlet="TableHead; context: {$implicit: 'Дата подачи'}"></ng-container>
    <ng-container ngTemplateOutlet="TableHead; context: {$implicit: 'Срок ответа'}"></ng-container>
  </tr>
</thead>

<ng-template #TableHead let-name=name>
  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">name</th>
</ng-template>
```
Пример 2

## ❌ Плохой код (Дублирование)
```typescript
this.form.controls.submission_date.valueChanges.subscribe(() => this.calculateDeadline());
this.form.controls.submission_time.valueChanges.subscribe(() => this.calculateDeadline());
this.form.controls.deadline_type.valueChanges.subscribe(() => this.calculateDeadline());
```

## ✅ **Правильное решение с автоматической отпиской**

```typescript
  merge(
    this.form.controls.submission_date.valueChanges,
    this.form.controls.submission_time.valueChanges,
    this.form.controls.deadline_type.valueChanges
  ).pipe(
    takeUntilDestroyed(this.destroyRef)
  ).subscribe(() => this.calculateDeadline());
```

Пример 3
priority связаны между собой, по бизнес логики мы говорим об одном и том же, но в коде продублированы
## ❌ Плохой код

```typescript
type FormConfig = {
  name: FormControl<string>;
  email: FormControl<string>;
  priority: FormControl<'low' | 'medium' | 'high'>;
}

type ApiRequest = {
  title: string;
  description: string;
  priority?: 'low' | 'medium' | 'high';
}

type TableItem = {
  id: string;
  name: string;
  priority: 'low' | 'medium' | 'high';
}
```

## ✅ Хороший код

```typescript
type Priority = 'low' | 'medium' | 'high';

type FormConfig = {
  name: FormControl<string>;
  email: FormControl<string>;
  priority: FormControl<Priority>;
}

type ApiRequest = {
  title: string;
  description: string;
  priority?: Priority;
}

type TableItem = {
  id: string;
  name: string;
  priority: Priority;
}
```


Пример 4
## ❌ Плохой код
```ts
prepareExportData(): Observable<Record<string, unknown[]>> {...}

this.prepareExportData().subscribe(downloadAsJsonFile)

downloadAsJsonFile(data: Record<string, unknown>) {}
```

**Проблемы:**
- Тип строиться повторно, нет единой точки входа

## ✅ Хороший код (создаём промежуточный тип)

```ts
prepareExportData(): Observable<ExportDataCollection> {...}

this.prepareExportData().subscribe(downloadAsJsonFile)

downloadAsJsonFile(data: ExportDataCollection) {}
```


### 10.2 Правило:


### 10.3 Правило: Разделение методов с противоположной логикой
Создавай отдельные методы для действий с противоположной логикой вместо перегрузки одного метода условиями. Каждый метод должен выполнять одну четкую задачу.

### Критерии разделения:
- Разные бизнес-процессы (редактирование vs отмена)
- Противоположные действия (включить vs выключить)
- Разные side effects (сброс формы vs сохранение)

## ❌ Плохой код (Перегруженный метод)

```typescript
toggleEdit(): void {
    this.isEditing.update((v) => !v);
    if (!this.isEditing()) {
      // Reset form to original values
      this.populateForm(this.application()!);
    }
}
```

**Проблемы:**
- Нарушение принципа единой ответственности (SRP)
- Сложность понимания логики
- Невозможность использовать отдельно редактирование или отмену
- Усложнение тестирования

## ✅ Хороший код (Раздельные методы)

### Вариант 1: Четкое разделение
```typescript
enableEdit(): void {
    this.isEditing.set(true);
}

cancelEdit(): void {
    this.isEditing.set(false);
    this.populateForm(this.application()!);
}
```

### Вариант 2: С переключением, но без логики внутри
```typescript
toggleEdit(): void {
    this.isEditing.update(v => !v);
}

// Отдельный метод для обработки отмены
onCancel(): void {
    this.populateForm(this.application()!);
    this.isEditing.set(false);
}
```


### 10.4 

### 10.5 избегаем логики в шаблоне
Вместо установки значения в шаблоне лучше создать отдельную функцию которая выполнит эту операцию

## ❌ Плохой код
```
<input type="text" (input)="dateTo.set($any($event.target).value)" />
```
## ✅ Хороший код
```
<input type="text" (input)="dataChange($event)" />

dataChange(data: SomeType) {
 ...
}
```


### 10.6 




### 10.7 Современный JS
#### 10.7.1 Опциональное связывание

#### ❌ Плохо
```ts
 !!node.children && node.children.length > 0
```

#### ✅ Хорошо
```ts
  node.children?.length > 0
```

### 10.8 Не использовать async/await вместо этого RXJS
async/await блокирует поток привнося в него синхронность, что мешает привычное работе JS.
