import { PrizeFE } from './prize.model';

export interface AttemptModel {
  date: string;       // e.g., "07.06.2026"
  time: string;       // e.g., "16:40:11"
  result: PrizeFE;
}
