import { Injectable, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { rxResource } from '@angular/core/rxjs-interop';
import { delay } from 'rxjs';
import { prizeApiMapper } from '../api-mapper/puzzle-api.mapper';
import { PrizeFE } from '@core/models/prize.model';
import { PrizeResponseDto } from './prize.dto';
import { FORTUNE_TECHNICAL_CONFIG } from '@core/constants/fortune.config';

/**
 * Фасад для работы с API призов. Загружает данные с искусственной задержкой для демонстрации лоадера.
 * Объявлен локально Injectable.
 */
@Injectable()
export class PrizeApiFacade {
  private readonly http = inject(HttpClient);

  // Реактивный HTTP-ресурс на rxResource с искусственной задержкой
  private readonly prizesResource = rxResource({
    stream: () => this.http.get<PrizeResponseDto>('assets/prizes.json').pipe(
      delay(FORTUNE_TECHNICAL_CONFIG.prizesLoadDelay)
    )
  });

  // Сигнал со списком призов
  public readonly prizes = computed<PrizeFE[]>(() => {
    const response = this.prizesResource.value();
    return response ? prizeApiMapper(response.prizes) : [];
  });

  // Сигнал статуса загрузки
  public readonly loading = this.prizesResource.isLoading;

  // Сигнал ошибки
  public readonly error = computed<string | null>(() => 
    this.prizesResource.error() ? 'Не удалось загрузить список призов' : null
  );
}
