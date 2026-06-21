import {
  AuditService,
  AxiosHttpService,
  OperationResult,
} from 'mvc-common-toolkit';

import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ENV_KEY, INJECTION_TOKEN } from '@shared/constants';
import { OutboundPartnerService } from '@shared/services/outbound-partner.service';

import { StocksService } from '@modules/stocks/services/stocks.service';
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
    // Use StocksService to compute summary from the database
    const classificationResult =
      await this.stocksService.getClassificationSummary();
    if (!classificationResult.success) {
      return { success: false, message: classificationResult.message } as any;
    }
    // For now, we set needsUpdate to false and totalRecords to 0 (placeholder)
    return {
      success: true,
      data: {
        totalStocks: classificationResult.data.total,
        // timestamp as number (ms since epoch) to match DTO
        updated: Date.now(),
        // 0 = no update needed, 1 = needs update
        needsUpdate: 0,
        totalRecords: 0,
      },
    };
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
    const { stocks, total, limit, offset } = serviceResult.data;
    // Map Stock entities to DataManagementStockDto shape
    const dmStocks: DataManagementStockDto[] = stocks.map((s) => ({
      symbol: s.symbol,
      lastUpdated: (s as any).lastUpdated || null,
      totalRecords: (s as any).totalRecords || 0,
      status: (s as any).status || 'unknown',
    }));
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
