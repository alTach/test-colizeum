import { Component, inject, DestroyRef, viewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { switchMap, timer } from 'rxjs';
import { PrizeApiFacade } from '@api/prize.facade';
import { AttemptsService } from '@core/services/attempts.service';
import { FortuneStore } from '@store/fortuna/fortune.store';
import { FORTUNE_STORE_PROVIDER } from '@store/fortuna/fortune-store.provider';
import { PrizeFE } from '@core/models/prize.model';
import { FORTUNE_BUSINESS_RULES, FORTUNE_TECHNICAL_CONFIG } from '@core/constants/fortune.config';
import {
  calculateSpinTargetAngle,
  getFortuneSpinTargetAngle,
  selectWeightedPrize,
} from '@core/utils/fortune-math.utils';
import { WheelComponent } from './component/wheel/wheel.component';
import { ResultModalComponent } from './component/result-modal/result-modal.component';
import { FortuneHistoryComponent } from './component/history/history.component';

/**
 * Основная страница игры «Колесо фортуны». Координирует логику игры, лимиты и отображение.
 */
@Component({
  selector: 'cl-fortune-game',
  imports: [WheelComponent, ResultModalComponent, FortuneHistoryComponent],
  providers: [
    PrizeApiFacade,
    AttemptsService,
    FORTUNE_STORE_PROVIDER
  ],
  templateUrl: './fortune-game.component.html',
  styleUrl: './fortune-game.component.scss',
})
export class FortuneGameComponent {
  protected readonly prizeFacade = inject(PrizeApiFacade);
  private readonly attemptsService = inject(AttemptsService);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly store = inject(FortuneStore);
  protected selectedPrize: PrizeFE | null = null;

  // Безопасные сигнальные ссылки на дочерние компоненты
  private readonly wheelComponent = viewChild(WheelComponent);
  private readonly resultModal = viewChild(ResultModalComponent);

  /**
   * Запустить вращение колеса
   */
  onSpin(): void {
    const wheel = this.wheelComponent();
    const prizes = this.prizeFacade.prizes();
    const cannotSpin = !wheel || this.store.spinning() || this.store.remainingAttempts() <= 0 || prizes.length === 0;
    if (cannotSpin) {
      return;
    }

    const winner = selectWeightedPrize(prizes);
    const winnerIndex = prizes.findIndex((p) => p.id === winner.id);

    // Вычисляем целевой угол с помощью вынесенной математической утилиты
    const targetAngle = getFortuneSpinTargetAngle(winnerIndex, this.store.currentAngle());

    // Блокировка интерфейса и старт
    this.store.startSpin();

    // Анимация
    wheel
      .spin(targetAngle)
      .pipe(
        // Задержка перед показом модалки (вынесено в константы конфигурации)
        switchMap(() => timer(FORTUNE_BUSINESS_RULES.resultModalDelay)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => {
        // Записать попытку в историю
        const { dailyAttemptsUsed, history } = this.attemptsService.recordAttempt(winner);

        this.store.finishSpin(winner, targetAngle);
        this.store.updateAttempts(dailyAttemptsUsed, history);

        // Открыть модалку
        this.selectedPrize = winner;

        const modal = this.resultModal();
        if (modal) {
          modal.open();
        }

        console.log('Выигранный приз:', winner);
      });
  }

  /**
   * Очистить историю попыток
   */
  onClearHistory(): void {
    const updatedHistory = this.attemptsService.clearHistory();
    this.store.updateAttempts(this.store.dailyAttemptsUsed(), updatedHistory);
  }
}
