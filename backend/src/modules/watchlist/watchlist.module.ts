import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from '@modules/user/user.module';

import { WatchlistController } from './controllers/watchlist.controller';
import { WatchlistItem } from './entities/watchlist.model';
import { WatchlistService } from './services/watchlist.service';

@Module({
  imports: [TypeOrmModule.forFeature([WatchlistItem]), UserModule],
  controllers: [WatchlistController],
  providers: [WatchlistService],
})
export class WatchlistModule {}
