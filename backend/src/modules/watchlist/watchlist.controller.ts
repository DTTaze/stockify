import { HttpResponse } from 'mvc-common-toolkit';

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

import { User } from '@modules/user/entities/user.entity';

import { RequestUser } from '@shared/decorators/request-user.decorator';
import { AuthGuard } from '@shared/guards/auth.guard';

import { AddWatchlistDTO } from './watchlist.dto';
import { WatchlistService } from './watchlist.service';

@ApiTags('Watchlist')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('watchlist')
export class WatchlistController {
  constructor(protected watchlistService: WatchlistService) {}

  @Get()
  async getWatchlist(@RequestUser() user: User): Promise<HttpResponse> {
    return this.watchlistService.getWatchlistByUserId(user.id);
  }

  @Post()
  async addToWatchlist(
    @RequestUser() user: User,
    @Body() dto: AddWatchlistDTO,
  ): Promise<HttpResponse> {
    return this.watchlistService.addToWatchlist(user.id, dto);
  }

  @Delete(':symbol')
  async removeFromWatchlist(
    @RequestUser() user: User,
    @Param('symbol') symbol: string,
  ): Promise<HttpResponse> {
    return this.watchlistService.removeFromWatchlist(user.id, symbol);
  }
}
