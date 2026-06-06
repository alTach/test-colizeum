import { inject, Injectable } from '@angular/core';
import { WaStorageService } from '@ng-web-apis/storage';
import { AttemptModel } from '@core/models/attempt.model';
import { PrizeFE } from '@core/models/prize.model';
import { FORTUNE_BUSINESS_RULES } from '@core/constants/fortune.config';
import { STORAGE_KEYS } from '@core/constants/storage-keys.constants';
import { createAttempt } from '@core/utils/fortune-math.utils';

/**
 * Сервис попыток. Управляет лимитами попыток (сброс в полночь) и историей в localStorage.
 */
@Injectable()
export class AttemptsService {
  private readonly storage = inject(WaStorageService);

  /**
   * Получить текущую дату строкой
   */
  private getTodayDateString(): string {
    const d = new Date();
    return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
  }

  /**
   * Получить количество использованных попыток за сегодня
   */
  getDailyAttemptsUsed(): number {
    this.checkMidnightReset();
    const val = this.storage.getItem(STORAGE_KEYS.dailyCount);
    return val ? parseInt(val, 10) : 0;
  }

  /**
   * Получить историю попыток
   */
  getHistory(): AttemptModel[] {
    const val = this.storage.getItem(STORAGE_KEYS.history);
    if (!val) return [];
    try {
      return JSON.parse(val) as AttemptModel[];
    } catch {
      return [];
    }
  }

  /**
   * Сбросить попытки в полночь
   */
  checkMidnightReset(): void {
    const today = this.getTodayDateString();
    const lastDate = this.storage.getItem(STORAGE_KEYS.lastDate);
    if (lastDate !== today) {
      this.storage.setItem(STORAGE_KEYS.lastDate, today);
      this.storage.setItem(STORAGE_KEYS.dailyCount, '0');
    }
  }

  /**
   * Сохранить новую попытку и обновить лимит
   *
   * @param winner Выигранный приз
   */
  recordAttempt(winner: PrizeFE): { dailyAttemptsUsed: number; history: AttemptModel[] } {
    this.checkMidnightReset();

    const currentUsed = this.getDailyAttemptsUsed();
    const newUsed = Math.min(FORTUNE_BUSINESS_RULES.maxDailyAttempts, currentUsed + 1);
    this.storage.setItem(STORAGE_KEYS.dailyCount, newUsed.toString());

    // Генерируем запись попытки
    const attempt = createAttempt(winner);

    const history = this.getHistory();
    const updatedHistory = [attempt, ...history].slice(0, FORTUNE_BUSINESS_RULES.historyLimit);
    this.storage.setItem(STORAGE_KEYS.history, JSON.stringify(updatedHistory));

    return {
      dailyAttemptsUsed: newUsed,
      history: updatedHistory
    };
  }

  /**
   * Очистить историю попыток
   */
  clearHistory(): AttemptModel[] {
    this.storage.removeItem(STORAGE_KEYS.history);
    return [];
  }
}
