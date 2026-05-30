import {
  AuditService,
  AxiosHttpService,
  OperationResult,
} from 'mvc-common-toolkit';

import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ENV_KEY, INJECTION_TOKEN } from '@shared/constants';
import { OutboundPartnerService } from '@shared/services/outbound-partner.service';

import {
  DataManagementStockDto,
  DataManagementSummaryDto,
  DataUpdateAllResponseDto,
  DataUpdateResponseDto,
  QueryDataManagementStocksDTO,
} from './data-management.dto';

@Injectable()
export class DataManagementService extends OutboundPartnerService {
  private readonly logger = new Logger(DataManagementService.name);

  constructor(
    private readonly configService: ConfigService,

    @Inject(INJECTION_TOKEN.HTTP_SERVICE)
    protected readonly httpService: AxiosHttpService,

    @Inject(INJECTION_TOKEN.AUDIT_SERVICE)
    protected readonly auditService: AuditService,
  ) {
    super(httpService, auditService);
  }

  protected get baseUrl(): string {
    return this.configService.getOrThrow<string>(ENV_KEY.ML_SERVICE_URL);
  }

  public async getDataManagementSummary(): Promise<
    OperationResult<DataManagementSummaryDto>
  > {
    return this.request<DataManagementSummaryDto>(
      'get',
      '/data-management/summary',
    ) as any;
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
    const { keyword, status, limit, offset } = query;
    const result = await this.request<any>('get', '/data-management/stocks');

    if (!result.success || !result.data) {
      return result as any;
    }

    const rawData = result.data;
    const stocks: DataManagementStockDto[] = Array.isArray(rawData)
      ? rawData
      : ((rawData as any)?.stocks ?? []);

    let filtered = stocks;

    if (keyword) {
      const kw = keyword.toLowerCase();
      filtered = filtered.filter((stock) =>
        stock.symbol.toLowerCase().includes(kw),
      );
    }

    if (status && status !== 'all') {
      filtered = filtered.filter((stock) => stock.status === status);
    }

    const total = filtered.length;
    const parsedLimit = limit !== undefined ? Number(limit) : 10;
    const parsedOffset = offset !== undefined ? Number(offset) : 0;
    const sliced = filtered.slice(parsedOffset, parsedOffset + parsedLimit);

    return {
      success: true,
      data: {
        stocks: sliced,
        total,
        limit: parsedLimit,
        offset: parsedOffset,
      },
    } as any;
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
