

export enum PrizeTypeDto {
  EMPTY = 'empty',
  PRIZE = 'prize'
}

export type PrizeDto = {
  id: number;
  label: string;
  type: PrizeTypeDto;
  weight: number;
  icon: string;
};

export type PrizeResponseDto = {
  prizes: PrizeDto[];
};
