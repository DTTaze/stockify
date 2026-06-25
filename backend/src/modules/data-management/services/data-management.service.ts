import {
  AuditService,
  AxiosHttpService,
  OperationResult,
} from 'mvc-common-toolkit';

import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { StocksService } from '@modules/stocks/services/stocks.service';

import { ENV_KEY, INJECTION_TOKEN } from '@shared/constants';
import { OutboundPartnerService } from '@shared/services/outbound-partner.service';

import {
  DataManagementStockDto,
  DataManagementSummaryDto,
  DataUpdateAllResponseDto,
  DataUpdateResponseDto,
  QueryDataManagementStocksDTO,
} from '../dto/data-management.dto';

@Injectable()
export class DataManagementService extends OutboundPartnerService {
  private readonly logger = new Logger(DataManagementService.name);
  constructor(
    private readonly configService: ConfigService,
    @Inject(INJECTION_TOKEN.HTTP_SERVICE)
    protected readonly httpService: AxiosHttpService,
    @Inject(INJECTION_TOKEN.AUDIT_SERVICE)
    protected readonly auditService: AuditService,
    private readonly stocksService: StocksService,
  ) {
    super(httpService, auditService);
  }

  protected get baseUrl(): string {
    return this.configService.getOrThrow<string>(ENV_KEY.ML_SERVICE_URL);
  }

  public async getDataManagementSummary(): Promise<
    OperationResult<DataManagementSummaryDto>
  > {
    try {
      const summary = await this.stocksService.getDataSummary();
      return {
        success: true,
        data: summary,
      };
    } catch (error) {
      this.logger.error('Failed to fetch data management summary', error);
      return {
        success: false,
        message: `Failed to fetch summary: ${error instanceof Error ? error.message : String(error)}`,
      } as any;
    }
  }

  private getStatus(lastUpdated: Date | null): string {
    if (!lastUpdated) {
      return 'needs_update';
    }

    const now = new Date();
    // Normalize now and lastUpdated to local midnight to perform calendar day comparisons
    const todayLocal = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
    const lastUpdatedMidnight = new Date(
      lastUpdated.getFullYear(),
      lastUpdated.getMonth(),
      lastUpdated.getDate(),
    );

    const diffTime = todayLocal.getTime() - lastUpdatedMidnight.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

    let maxAllowedDays = 1; // Standard: 1 day old (yesterday) is fine

    if (dayOfWeek === 0) {
      // Sunday: Friday data (2 days ago) is fine
      maxAllowedDays = 2;
    } else if (dayOfWeek === 6) {
      // Saturday: Friday data (1 day ago) is fine
      maxAllowedDays = 1;
    } else if (dayOfWeek === 1) {
      // Monday: Friday data (3 days ago) is fine before today's close
      maxAllowedDays = 3;
    } else {
      // Tue-Fri: yesterday's data is fine (1 day old)
      maxAllowedDays = 1;
    }

    return diffDays <= maxAllowedDays ? 'updated' : 'needs_update';
  }

  public async getDataManagementStocks(
    query: QueryDataManagementStocksDTO,
  ): Promise<
    OperationResult<{
      stocks: DataManagementStockDto[];
      total: number;
      limit: number;
      offset: number;
    }>
  > {
    // Delegate to StocksService which reads from the database
    const serviceResult = await this.stocksService.getStocks(query);
    if (!serviceResult.success) {
      return { success: false, message: serviceResult.message } as any;
    }
    const { rows: stocks = [], total, limit, offset } = serviceResult.data;

    // Fetch stats for these specific symbols
    const symbols = stocks.map((s) => s.symbol);
    const statsMap = await this.stocksService.getStockStats(symbols);

    // Map Stock entities to DataManagementStockDto shape with stats
    const dmStocks: DataManagementStockDto[] = stocks.map((s) => {
      const stats = statsMap[s.symbol] || {
        totalRecords: 0,
        lastUpdated: null,
      };
      const isoDate = stats.lastUpdated
        ? stats.lastUpdated.toISOString()
        : null;
      return {
        symbol: s.symbol,
        lastUpdated: isoDate,
        last_updated: isoDate,
        totalRecords: stats.totalRecords,
        total_records: stats.totalRecords,
        status: this.getStatus(stats.lastUpdated),
      };
    });

    return {
      success: true,
      data: {
        stocks: dmStocks,
        total,
        limit,
        offset,
      },
    };
  }

  public async updateStockData(
    symbol: string,
  ): Promise<OperationResult<DataUpdateResponseDto>> {
    return this.request<DataUpdateResponseDto>(
      'post',
      `/data-management/update/${symbol.toUpperCase()}`,
    ) as any;
  }

  public async updateAllStockData(): Promise<
    OperationResult<DataUpdateAllResponseDto>
  > {
    return this.request<DataUpdateAllResponseDto>(
      'post',
      '/data-management/update-all',
    ) as any;
  }
}
