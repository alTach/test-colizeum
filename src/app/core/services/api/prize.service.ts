import { inject, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PrizeResponseDto } from './prize.dto';

@Service()
export class PrizeApiService {
  private http = inject(HttpClient);

  public getPrizes() {
    return this.http.get<PrizeResponseDto>('assets/prizes.json');
  }
}
