import { IsAlphanumeric, IsNotEmpty, MaxLength } from 'class-validator';

export class AddWatchlistDTO {
  @IsNotEmpty()
  @IsAlphanumeric()
  @MaxLength(10)
  symbol: string;
}
