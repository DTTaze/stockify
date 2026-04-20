import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AddWatchlistDTO } from './watchlist.dto';
import { WatchlistItem } from './watchlist.model';

@Injectable()
export class WatchlistService {
  constructor(
    @InjectRepository(WatchlistItem)
    private readonly repo: Repository<WatchlistItem>,
  ) {}

  async getByUserId(userId: string) {
    return this.repo.find({ where: { userId } });
  }

  async add(userId: string, dto: AddWatchlistDTO) {
    const exists = await this.repo.findOne({
      where: { userId, symbol: dto.symbol },
    });

    if (exists) {
      return { success: false, message: 'Symbol already in watchlist' };
    }

    const item = this.repo.create({ userId, symbol: dto.symbol });
    await this.repo.save(item);

    return { success: true };
  }

  async remove(userId: string, symbol: string) {
    await this.repo.delete({ userId, symbol });
    return { success: true };
  }
}
