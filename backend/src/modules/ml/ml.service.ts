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
  IndexQuoteDto,
  MarketQuoteDto,
  PredictionDto,
  SupportedSymbolsDto,
} from './ml.dto';

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
    try {
      const response = await this.httpService.send(
        'get',
        this.baseUrl + `/market/quote`,
        {
          query: {
            symbol: dto.symbol,
            type: dto.type,
            period: dto.period,
          },
        },
      );

      if (response.success) {
        return {
          success: true,
          data: response.data,
        };
      }

      return {
        success: false,
        message: response.message || 'internal server error',
      };
    } catch (error) {
      this.logger.error(`Failed to fetch index quote for ${dto.symbol}`);
      throw error;
    }
  }

  public async getMarketHistory(
    dto: MarketQuoteDto,
  ): Promise<OperationResult<IndexQuoteDto>> {
    try {
      const response = await this.httpService.send(
        'get',
        this.baseUrl + `/market/historical`,
        {
          query: {
            symbol: dto.symbol,
            type: dto.type,
            period: dto.period,
          },
        },
      );

      if (response.success) {
        return {
          success: true,
          data: response.data.data,
        };
      }

      return {
        success: false,
        message: response.message || 'internal server error',
      };
    } catch (error) {
      this.logger.error(`Failed to fetch index quote for ${dto.symbol}`);
      throw error;
    }
  }

  public async getPrediction(
    symbol: string,
  ): Promise<OperationResult<PredictionDto>> {
    try {
      const response = await this.httpService.send(
        'get',
        this.baseUrl + `/prediction/${symbol.toUpperCase()}`,
      );

      if (response.success && response.data) {
        return {
          success: true,
          data: response.data,
        };
      }

      return {
        success: false,
        message: response.message || 'Failed to fetch prediction',
      };
    } catch (error) {
      this.logger.error(`Failed to fetch prediction for ${symbol}`);
      return {
        success: false,
        message: 'Failed to fetch prediction',
      };
    }
  }

  public async getSupportedSymbols(): Promise<
    OperationResult<SupportedSymbolsDto>
  > {
    try {
      const response = await this.httpService.send(
        'get',
        this.baseUrl + `/prediction/symbols`,
      );

      if (response.success && response.data) {
        return {
          success: true,
          data: response.data,
        };
      }

      return {
        success: false,
        message: response.message || 'Failed to fetch supported symbols',
        data: { symbols: [] },
      };
    } catch (error) {
      this.logger.error('Failed to fetch supported symbols');
      return {
        success: false,
        message: 'Failed to fetch supported symbols',
        data: { symbols: [] },
      };
    }
  }

  public async getDataManagementSummary(): Promise<
    OperationResult<DataManagementSummaryDto>
  > {
    try {
      const response = await this.request<DataManagementSummaryDto>(
        'get',
        '/data-management/summary',
      );

      if (response.success && response.data) {
        return {
          success: true,
          data: response.data,
        };
      }

      return {
        success: false,
        message: response.message || 'Failed to fetch data management summary',
      };
    } catch (error) {
      this.logger.error('Failed to fetch data management summary');
      return {
        success: false,
        message: 'Failed to fetch data management summary',
      };
    }
  }

  public async getDataManagementStocks(): Promise<
    OperationResult<DataManagementStockDto[]>
  > {
    try {
      const response = await this.request<DataManagementStockDto[]>(
        'get',
        '/data-management/stocks',
      );

      if (response.success && response.data) {
        return {
          success: true,
          data: response.data,
        };
      }

      return {
        success: false,
        message: response.message || 'Failed to fetch data management stocks',
        data: [],
      };
    } catch (error) {
      this.logger.error('Failed to fetch data management stocks');
      return {
        success: false,
        message: 'Failed to fetch data management stocks',
        data: [],
      };
    }
  }

  public async updateStockData(
    symbol: string,
  ): Promise<OperationResult<DataUpdateResponseDto>> {
    try {
      const response = await this.request<DataUpdateResponseDto>(
        'post',
        `/data-management/update/${symbol.toUpperCase()}`,
      );

      if (response.success && response.data) {
        return {
          success: true,
          data: response.data,
        };
      }

      return {
        success: false,
        message: response.message || 'Failed to update stock data',
      };
    } catch (error) {
      this.logger.error(`Failed to update stock data for ${symbol}`);
      return {
        success: false,
        message: 'Failed to update stock data',
      };
    }
  }

  public async updateAllStockData(): Promise<
    OperationResult<DataUpdateAllResponseDto>
  > {
    try {
      const response = await this.request<DataUpdateAllResponseDto>(
        'post',
        '/data-management/update-all',
      );

      if (response.success && response.data) {
        return {
          success: true,
          data: response.data,
        };
      }

      return {
        success: false,
        message: response.message || 'Failed to update all stock data',
      };
    } catch (error) {
      this.logger.error('Failed to update all stock data');
      return {
        success: false,
        message: 'Failed to update all stock data',
      };
    }
  }
}
