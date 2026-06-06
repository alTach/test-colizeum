import { Provider } from '@angular/core';
import { AttemptsService } from '@core/services/attempts.service';
import { FortuneStore } from './fortune.store';

/**
 * Фабричная функция для инициализации хранилища FortuneStore.
 * Подгружает из локального хранилища AttemptsService количество использованных
 * попыток за день и историю спинов, после чего обновляет состояние.
 *
 * @param attemptsService Сервис попыток
 * @returns Инициализированный инстанс FortuneStore
 */
export function fortuneStoreFactory(attemptsService: AttemptsService): FortuneStore {
  const store = new FortuneStore();
  const dailyUsed = attemptsService.getDailyAttemptsUsed();
  const history = attemptsService.getHistory();
  store.updateAttempts(dailyUsed, history);
  return store;
}

/**
 * Провайдер для локального внедрения FortuneStore с фабричной инициализацией.
 */
export const FORTUNE_STORE_PROVIDER: Provider = {
  provide: FortuneStore,
  useFactory: fortuneStoreFactory,
  deps: [AttemptsService],
};
