import { OperationResult } from 'mvc-common-toolkit';
import { Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { UserService } from '@modules/user/services/user.service';

import { BaseCRUDService } from '@shared/services/base-crud.service';

import { AddWatchlistDTO } from './watchlist.dto';
import { WatchlistItem } from './watchlist.model';

@Injectable()
export class WatchlistService extends BaseCRUDService<WatchlistItem> {
  constructor(
    @InjectRepository(WatchlistItem)
    protected repo: Repository<WatchlistItem>,
    protected userService: UserService,
  ) {
    super(repo);
  }

  async getWatchlistByUserId(
    userId: string,
  ): Promise<OperationResult<WatchlistItem[]>> {
    const items = await this.findAll({ userId });

    return { success: true, data: items };
  }

  async addToWatchlist(
    userId: string,
    dto: AddWatchlistDTO,
  ): Promise<OperationResult<WatchlistItem>> {
    const user = await this.userService.findByID(userId);

    if (!user) {
      return {
        success: false,
        message: 'User not found',
      };
    }

    const exists = await this.findOne(
      { userId, symbol: dto.symbol },
      { withDeleted: true },
    );

    if (exists) {
      if (exists.deletedAt === null) {
        return {
          success: false,
          message: 'Symbol already in watchlist',
        };
      }

      exists.deletedAt = null;
      const restored = await this.repo.save(exists);
      return {
        success: true,
        data: restored,
      };
    }

    const item = await this.create({
      userId,
      symbol: dto.symbol,
    });

    return {
      success: true,
      data: item,
    };
  }

  async removeFromWatchlist(
    userId: string,
    symbol: string,
  ): Promise<OperationResult<void>> {
    const exists = await this.findOne({ userId, symbol });

    if (!exists) {
      return { success: false, message: 'Symbol not found in watchlist' };
    }

    await this.deleteOne({ userId, symbol });

    return {
      success: true,
    };
  }
}
