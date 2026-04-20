import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { User } from '@modules/user/user.model';

import { RequestUser } from '@shared/decorators/request-user.decorator';
import { AuthGuard } from '@shared/guards/auth.guard';

import { AddWatchlistDTO } from './watchlist.dto';
import { WatchlistService } from './watchlist.service';

@ApiTags('Watchlist')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('watchlist')
export class WatchlistController {
  constructor(private readonly watchlistService: WatchlistService) {}

  @Get()
  async getWatchlist(@RequestUser() user: User) {
    const items = await this.watchlistService.getByUserId(user.id);
    return { success: true, data: items };
  }

  @Post()
  async addToWatchlist(@RequestUser() user: User, @Body() dto: AddWatchlistDTO) {
    return this.watchlistService.add(user.id, dto);
  }

  @Delete(':symbol')
  async removeFromWatchlist(
    @RequestUser() user: User,
    @Param('symbol') symbol: string,
  ) {
    return this.watchlistService.remove(user.id, symbol);
  }
}
