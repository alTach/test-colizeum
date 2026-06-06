import { Component, input, output } from '@angular/core';
import { AttemptModel } from '@core/models/attempt.model';

/**
 * Компонент списка истории попыток. Выводит дату, время и полученный результат спина.
 */
@Component({
  selector: 'cl-fortune-history',
  imports: [],
  templateUrl: './history.component.html',
  styleUrl: './history.component.scss',
})
export class FortuneHistoryComponent {
  readonly history = input.required<AttemptModel[]>();
  readonly clearHistory = output<void>();
}
