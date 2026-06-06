/**
 * Ключи, используемые для сохранения данных в LocalStorage.
 */
export const STORAGE_KEYS = {
  /** Ключ для хранения истории спинов */
  history: 'fortune_history',
  /** Ключ для хранения количества потраченных попыток за сегодня */
  dailyCount: 'fortune_daily_count',
  /** Ключ для хранения даты последней попытки (используется для сброса в полночь) */
  lastDate: 'fortune_last_date'
} as const;
