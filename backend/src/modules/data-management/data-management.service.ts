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
    try {
      const response = await this.httpService.send(
        'get',
        this.baseUrl + '/data-management/summary',
      );

      if (response.success) {
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
      const response = await this.httpService.send(
        'get',
        this.baseUrl + '/data-management/stocks',
      );

      if (response.success) {
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
      const response = await this.httpService.send(
        'post',
        this.baseUrl + `/data-management/update/${symbol.toUpperCase()}`,
      );

      if (response.success) {
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
      const response = await this.httpService.send(
        'post',
        this.baseUrl + '/data-management/update-all',
      );

      if (response.success) {
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
