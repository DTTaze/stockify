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
import { HttpResponse } from 'mvc-common-toolkit';

import { User } from '@modules/user/user.model';

import { RequestUser } from '@shared/decorators/request-user.decorator';
import { AuthGuard } from '@shared/guards/auth.guard';
import { generateInternalServerResult } from '@shared/helpers/operation-result.helper';

import { AddWatchlistDTO } from './watchlist.dto';
import { WatchlistService } from './watchlist.service';

@ApiTags('Watchlist')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('watchlist')
export class WatchlistController {
  constructor(private readonly watchlistService: WatchlistService) {}

  @Get()
  async getWatchlist(@RequestUser() user: User): Promise<HttpResponse> {
    const result = await this.watchlistService.getWatchlistByUserId(user.id);

    if (!result.success) {
      return generateInternalServerResult(result.message);
    }

    return { success: true, data: result.data };
  }

  @Post()
  async addToWatchlist(
    @RequestUser() user: User,
    @Body() dto: AddWatchlistDTO,
  ): Promise<HttpResponse> {
    const result = await this.watchlistService.addToWatchlist(user.id, dto);

    if (!result.success) {
      return generateInternalServerResult(result.message);
    }

    return { success: true, data: result.data };
  }

  @Delete(':symbol')
  async removeFromWatchlist(
    @RequestUser() user: User,
    @Param('symbol') symbol: string,
  ): Promise<HttpResponse> {
    const result = await this.watchlistService.removeFromWatchlist(user.id, symbol);

    if (!result.success) {
      return generateInternalServerResult(result.message);
    }

    return { success: true };
  }
}
