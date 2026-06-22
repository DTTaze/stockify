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
  IndexQuoteDto,
  MarketQuoteDto,
  PredictionDto,
  SupportedSymbolsDto,
} from '../dto/ml.dto';

@Injectable()
export class MLService extends OutboundPartnerService {
  private readonly logger = new Logger(MLService.name);

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

  public async getMarketQuote(
    dto: MarketQuoteDto,
  ): Promise<OperationResult<IndexQuoteDto>> {
    return this.request<IndexQuoteDto>('get', '/market/quote', dto) as any;
  }

  public async getMarketList(type: string): Promise<OperationResult<any[]>> {
    const result = await this.request<{ items: any[] }>('get', '/market/list', {
      type,
    });
    if (!result.success) {
      return result as any;
    }
    return {
      success: true,
      data: result.data?.items ?? [],
    };
  }

  public async getMarketHistory(
    dto: MarketQuoteDto,
  ): Promise<OperationResult<IndexQuoteDto>> {
    const result = await this.request<{ data: IndexQuoteDto }>(
      'get',
      '/market/historical',
      dto,
    );
    if (!result.success) {
      return result as any;
    }
    return {
      success: true,
      data: result.data?.data,
    };
  }

  public async getPrediction(
    symbol: string,
    modelType?: string,
  ): Promise<OperationResult<PredictionDto>> {
    return this.request<PredictionDto>(
      'get',
      `/prediction/${symbol.toUpperCase()}`,
      modelType ? { model_type: modelType } : undefined,
    ) as any;
  }

  public async getSupportedSymbols(): Promise<
    OperationResult<SupportedSymbolsDto>
  > {
    return this.request<SupportedSymbolsDto>(
      'get',
      '/prediction/symbols',
    ) as any;
  }

  public async getSymbolsByExchange(
    exchange: string,
  ): Promise<OperationResult<any[]>> {
    try {
      this.logger.log(`Starting stock crawl for exchange: ${exchange}`);
      const response = await this.request<any[]>(
        'get',
        `/market/stock-details`,
        { exchange },
      );

      if (!response.success || !response.data) {
        return {
          success: false,
          message: response.message || 'Failed to fetch symbols from FastAPI',
        };
      }

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      this.logger.error(
        `Failed to fetch symbols for exchange ${exchange}:`,
        error,
      );
      return {
        success: false,
        message: `Failed to fetch symbols for exchange ${exchange}: ${error.message}`,
      };
    }
  }

  public async getGroupedSymbols(): Promise<OperationResult<any>> {
    return this.request<any>('get', '/market/grouped-symbols') as any;
  }

  public async getIcbIndustries(): Promise<OperationResult<any[]>> {
    return this.request<any[]>('get', '/market/icb-industries') as any;
  }

  public async getSymbolsByIndustries(): Promise<OperationResult<any[]>> {
    return this.request<any[]>('get', '/market/symbols-by-industries') as any;
  }

  public async getFutures(): Promise<OperationResult<string[]>> {
    return this.request<string[]>('get', '/market/futures') as any;
  }

  public async getGovernmentBonds(): Promise<OperationResult<string[]>> {
    return this.request<string[]>('get', '/market/government-bonds') as any;
  }

  public async getIndices(): Promise<OperationResult<string[]>> {
    return this.request<string[]>('get', '/market/indices') as any;
  }
}
