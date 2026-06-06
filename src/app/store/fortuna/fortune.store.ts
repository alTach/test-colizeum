import { computed, Injectable, signal } from '@angular/core';
import { FortuneState, INITIAL_FORTUNE_STATE } from './fortune.model';
import { PrizeFE } from '@core/models/prize.model';
import { AttemptModel } from '@core/models/attempt.model';
import { FORTUNE_BUSINESS_RULES } from '@core/constants/fortune.config';

/**
 * Хранилище игрового состояния. Управляет реактивным состоянием колеса, спинов и попыток.
 */
@Injectable()
export class FortuneStore {
  private readonly state = signal<FortuneState>(INITIAL_FORTUNE_STATE);

  readonly snapshot = this.state.asReadonly();

  // Реактивные селекторы состояния
  readonly spinning = computed(() => this.state().spinning);
  readonly currentAngle = computed(() => this.state().currentAngle);
  readonly winnerPrize = computed(() => this.state().winnerPrize);

  readonly dailyAttemptsUsed = computed(() => this.state().dailyAttemptsUsed);
  readonly remainingAttempts = computed(() => this.state().remainingAttempts);
  readonly history = computed(() => this.state().history);

  /**
   * Обновить часть состояния
   */
  private patchState(patch: Partial<FortuneState>): void {
    this.state.update((state) => ({
      ...state,
      ...patch,
    }));
  }

  /**
   * Начать вращение колеса
   */
  startSpin(): void {
    this.patchState({
      spinning: true,
      winnerPrize: null,
    });
  }

  /**
   * Завершить вращение колеса с результатом
   */
  finishSpin(winnerPrize: PrizeFE, finalAngle: number): void {
    this.patchState({
      spinning: false,
      winnerPrize,
      currentAngle: finalAngle,
    });
  }

  /**
   * Обновить попытки и историю
   */
  updateAttempts(dailyAttemptsUsed: number, history: AttemptModel[]): void {
    this.patchState({
      dailyAttemptsUsed,
      remainingAttempts: Math.max(0, FORTUNE_BUSINESS_RULES.maxDailyAttempts - dailyAttemptsUsed),
      history,
    });
  }

  /**
   * Задать текущий угол колеса
   */
  setCurrentAngle(angle: number): void {
    this.patchState({
      currentAngle: angle,
    });
  }

  /**
   * Очистить историю попыток в состоянии
   */
  clearHistory(): void {
    this.patchState({
      history: [],
    });
  }

  /**
   * Сбросить всё состояние в начальное
   */
  reset(): void {
    this.state.set(INITIAL_FORTUNE_STATE);
  }
}
