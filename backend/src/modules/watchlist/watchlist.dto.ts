import { IsString } from 'class-validator';

export class AddWatchlistDTO {
  @IsString()
  symbol: string;
}
