import { PrizeFE } from '@core/models/prize.model';
import { AttemptModel } from '@core/models/attempt.model';
import { SectorUi } from '@core/models/sector-ui.model';
import { FORTUNE_TECHNICAL_CONFIG } from '@core/constants/fortune.config';

/**
 * Математические и вспомогательные утилиты для игры «Колесо фортуны».
 */

// Обертка, которая знает про конфиг
export function getFortuneSpinTargetAngle(winnerIndex: number, currentAngle: number): number {
  return calculateSpinTargetAngle(
    winnerIndex,
    currentAngle,
    FORTUNE_TECHNICAL_CONFIG.wheel.numSectors,
    FORTUNE_TECHNICAL_CONFIG.wheel.extraTurnsMin,
    FORTUNE_TECHNICAL_CONFIG.wheel.extraTurnsVar,
  );
};

/**
 * Вычисляет целевой угол вращения для выравнивания выигравшего сектора по центру под стрелкой.
 * Стрелка-указатель всегда находится в верхней точке 12 часов (угол -Math.PI / 2).
 * Стартовое положение барабана (середина первого сектора под стрелкой) сдвигается на уровне SVG-шаблона.
 *
 * @param winnerIndex Индекс сектора-победителя (0-11)
 * @param currentAngle Текущий угол поворота колеса в радианах
 * @param numSectors Общее число секторов на колесе (обычно 12)
 * @param extraTurnsMin Минимальное количество полных оборотов перед остановкой
 * @param extraTurnsVar Вариативность (диапазон случайных добавочных) полных оборотов
 * @returns Абсолютный целевой угол вращения в радианах
 */
export function calculateSpinTargetAngle(
  winnerIndex: number,
  currentAngle: number,
  numSectors: number = 12,
  extraTurnsMin: number = 5,
  extraTurnsVar: number = 5
): number {
  const ARC = (2 * Math.PI) / numSectors;

  // Центр выбранного сектора в локальных координатах колеса (без смещения).
  // Первый сектор начинается на 12 часах (-Math.PI / 2) и идет по часовой стрелке.
  const sectorMid = -Math.PI / 2 + winnerIndex * ARC;

  // Координата указателя (стрелка на 12 часах)
  const pointerAngle = -Math.PI / 2;

  // Разница углов между стрелкой и центром нужного сектора
  let diff = pointerAngle - sectorMid;
  diff = diff % (2 * Math.PI);
  if (diff < 0) {
    diff += 2 * Math.PI;
  }

  // Приведение текущего угла вращения к диапазону [0, 2*PI)
  const currentAbsolute = currentAngle % (2 * Math.PI);
  let normalizedCurrent = currentAbsolute;
  if (normalizedCurrent < 0) {
    normalizedCurrent += 2 * Math.PI;
  }

  // Расстояние в радианах, на которое нужно прокрутить колесо из текущего положения
  let delta = diff - normalizedCurrent;
  if (delta <= 0) {
    delta += 2 * Math.PI;
  }

  // Случайное число дополнительных полных оборотов
  const extraTurns = extraTurnsMin + Math.floor(Math.random() * extraTurnsVar);

  // Итоговый целевой угол
  return currentAngle + extraTurns * 2 * Math.PI + delta;
}

/**
 * Выбирает случайный приз с учетом весов по кумулятивному алгоритму.
 * Корректно обрабатывает нулевые веса и случай, когда Math.random() возвращает 0.
 *
 * @param prizes Список призов с весами
 * @returns Выбранный случайный приз
 */
export function selectWeightedPrize(prizes: PrizeFE[]): PrizeFE {
  const totalWeight = prizes.reduce((sum, p) => sum + p.weight, 0);
  if (totalWeight <= 0) {
    return prizes[0];
  }

  const randomValue = Math.random() * totalWeight;
  let cumulativeWeight = 0;

  for (const prize of prizes) {
    cumulativeWeight += prize.weight;
    if (randomValue < cumulativeWeight) {
      return prize;
    }
  }

  return prizes[prizes.length - 1];
}

/**
 * Преобразует модель приза во внутреннюю UI-структуру сектора SVG.
 * Вынесено в отдельную функцию для оптимизации переиспользования и сохранения декларативности.
 *
 * @param prize Фич-модель приза
 * @param i Индекс сектора
 * @param totalSectors Общее количество секторов
 * @returns Модель UI сектора колеса
 */
export function mapPrizeToSectorUi(prize: PrizeFE, i: number, totalSectors: number): SectorUi {
  const ARC = (2 * Math.PI) / totalSectors;
  const CX = FORTUNE_TECHNICAL_CONFIG.wheel.cx;
  const CY = FORTUNE_TECHNICAL_CONFIG.wheel.cy;
  const R = FORTUNE_TECHNICAL_CONFIG.wheel.r;
  const IR = FORTUNE_TECHNICAL_CONFIG.wheel.ir;

  const a0 = -Math.PI / 2 + i * ARC;
  const a1 = a0 + ARC;
  const mid = a0 + ARC / 2;
  const isGold = i % 2 === 0;

  const x0 = CX + R * Math.cos(a0);
  const y0 = CY + R * Math.sin(a0);
  const x1 = CX + R * Math.cos(a1);
  const y1 = CY + R * Math.sin(a1);

  const xi0 = CX + IR * Math.cos(a0);
  const yi0 = CY + IR * Math.sin(a0);
  const xi1 = CX + IR * Math.cos(a1);
  const yi1 = CY + IR * Math.sin(a1);

  const pathD = `M ${xi0} ${yi0} L ${x0} ${y0} A ${R} ${R} 0 0 1 ${x1} ${y1} L ${xi1} ${yi1} A ${IR} ${IR} 0 0 0 ${xi0} ${yi0} Z`;

  const edgeR = R - 20;
  const ex = CX + edgeR * Math.cos(mid);
  const ey = CY + edgeR * Math.sin(mid);
  const angle = (mid * 180) / Math.PI + 90;
  const textTransform = `translate(${ex}, ${ey}) rotate(${angle})`;

  const iconR = R * 0.52;
  const baseX = CX + iconR * Math.cos(mid);
  const baseY = CY + iconR * Math.sin(mid);

  const dotX = CX + (R - 3) * Math.cos(a0);
  const dotY = CY + (R - 3) * Math.sin(a0);

  return {
    id: prize.id,
    label: prize.label,
    icon: prize.icon,
    pathD,
    isGold,
    textTransform,
    baseX,
    baseY,
    dotX,
    dotY,
  };
}

/**
 * Создает объект попытки (AttemptModel) с текущей датой и временем.
 *
 * @param prize Выигранный приз
 * @returns Модель попытки с заполненными датой и временем
 */
export function createAttempt(prize: PrizeFE): AttemptModel {
  const now = new Date();
  const dateStr = now.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const timeStr = now.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return {
    date: dateStr,
    time: timeStr,
    result: prize,
  };
}

