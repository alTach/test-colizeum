import { PrizeDto } from '@api/prize.dto';
import { PrizeFE } from '@core/models/prize.model';

export function mapPrizeDtoToFE(dto: PrizeDto): PrizeFE {
  return {
    id: dto.id,
    label: dto.label,
    type: dto.type as 'empty' | 'prize',
    weight: dto.weight,
    icon: dto.icon
  };
}

export function prizeApiMapper(dtoData: PrizeDto[]): PrizeFE[] {
  return dtoData.map(mapPrizeDtoToFE);
}
