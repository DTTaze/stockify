import {
  AuditService,
  AxiosHttpService,
  OperationResult,
} from 'mvc-common-toolkit';

import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ENV_KEY, INJECTION_TOKEN } from '@shared/constants';
import { OutboundPartnerService } from '@shared/services/outbound-partner.service';

import { IndexQuoteDto, MarketQuoteDto } from './ml.dto';

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
    } catch (error) {
      this.logger.error(`Failed to fetch index quote for ${dto.symbol}`);
      throw error;
    }
  }
}
