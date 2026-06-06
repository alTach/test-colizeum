import { PrizeFE } from '@core/models/prize.model';
import { AttemptModel } from '@core/models/attempt.model';
import { FORTUNE_BUSINESS_RULES } from '@core/constants/fortune.config';

export type FortuneState = {
  /** Идет ли анимация вращения колеса в данный момент */
  spinning: boolean;
  /** Текущий накопленный угол поворота колеса в радианах */
  currentAngle: number;
  /** Выигранный приз в текущем/последнем раунде (null, если колесо еще не запускалось или идет вращение) */
  winnerPrize: PrizeFE | null;
  
  /** Количество попыток, использованных сегодня пользователем */
  dailyAttemptsUsed: number;
  /** Количество оставшихся попыток на сегодня */
  remainingAttempts: number;
  /** Список истории последних попыток (последние 10 записей) */
  history: AttemptModel[];
};

export const INITIAL_FORTUNE_STATE: FortuneState = {
  spinning: false,
  currentAngle: 0,
  winnerPrize: null,
  
  dailyAttemptsUsed: 0,
  remainingAttempts: FORTUNE_BUSINESS_RULES.maxDailyAttempts,
  history: []
};
