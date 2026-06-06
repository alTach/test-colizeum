export type PrizeTypeFE = 'empty' | 'prize';

export interface PrizeFE {
  id: number;
  label: string;
  type: PrizeTypeFE;
  weight: number;
  icon: string;
}
