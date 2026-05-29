import {
  AuditService,
  AxiosHttpService,
  OperationResult,
} from 'mvc-common-toolkit';
import { Repository } from 'typeorm';

import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';

import { ENV_KEY, INJECTION_TOKEN } from '@shared/constants';
import { BaseCRUDService } from '@shared/services/base-crud.service';

import { MLService } from '../ml/ml.service';
import { ExchangeFilter, QueryStocksDTO } from './stocks.dto';
import { Stock } from './stocks.model';

@Injectable()
export class StocksService extends BaseCRUDService<Stock> {
  private readonly logger = new Logger(StocksService.name);

  constructor(
    @InjectRepository(Stock)
    protected repo: Repository<Stock>,

    private readonly configService: ConfigService,

    @Inject(INJECTION_TOKEN.HTTP_SERVICE)
    protected readonly httpService: AxiosHttpService,

    @Inject(INJECTION_TOKEN.AUDIT_SERVICE)
    protected readonly auditService: AuditService,

    private readonly mlService: MLService,
  ) {
    super(repo);
  }

  protected get baseUrl(): string {
    return this.configService.getOrThrow<string>(ENV_KEY.ML_SERVICE_URL);
  }

  public async getStocks(query: QueryStocksDTO): Promise<OperationResult> {
    const filter: any = {};
    if (query.exchange && query.exchange !== ExchangeFilter.ALL) {
      filter.exchange = query.exchange;
    }

    const keywordColumns: (keyof Stock)[] = ['symbol', 'name'];
    const result = await this.paginateByKeyword(
      query,
      keywordColumns,
      query.keyword,
      filter,
    );

    return {
      success: true,
      data: result,
    };
  }

  public async crawlAndSave(
    exchange: ExchangeFilter,
  ): Promise<OperationResult> {
    try {
      const response = await this.mlService.getSymbolsByExchange(exchange);

      if (!response.success || !response.data) {
        return {
          success: false,
          message: response.message || 'Failed to fetch symbols from FastAPI',
        };
      }

      const crawledItems = response.data;
      this.logger.log(
        `Fetched ${crawledItems.length} stocks. Upserting into DB...`,
      );

      const insertedCount = await this.upsertStocksInChunks(crawledItems);

      this.logger.log(
        `Successfully synced ${insertedCount} stocks into the database.`,
      );
      return {
        success: true,
        data: {
          total: crawledItems.length,
          synced: insertedCount,
        },
        message: 'Stocks crawl completed successfully',
      };
    } catch (error) {
      this.logger.error('Error in crawlAndSave:', error);
      return {
        success: false,
        message: `Stock crawl failed: ${error.message}`,
      };
    }
  }

  private async upsertStocksInChunks(
    crawledItems: any[],
    chunkSize = 200,
  ): Promise<number> {
    let insertedCount = 0;

    for (let i = 0; i < crawledItems.length; i += chunkSize) {
      const chunk = crawledItems.slice(i, i + chunkSize);
      const stockEntities = chunk.map((item) => {
        const stock = new Stock();
        stock.symbol = item.symbol;
        stock.exchange = item.exchange;
        stock.name = item.organ_name || item.organ_short_name || '';
        stock.type = item.type;
        stock.sid = item.sid;
        stock.enOrganName = item.en_organ_name;
        stock.enOrganShortName = item.en_organ_short_name;
        stock.organShortName = item.organ_short_name;
        stock.organName = item.organ_name;
        stock.productGrpId = item.product_grp_id;
        stock.icbCode2 = item.icb_code2;
        return stock;
      });

      await this.repo.upsert(stockEntities, ['symbol']);
      insertedCount += chunk.length;
    }

    return insertedCount;
  }
}
