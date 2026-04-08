import {
  AuditService,
  ErrorLog,
  HttpMethod,
  HttpRequestOption,
  HttpResponse,
  HttpService,
  stringUtils,
} from 'mvc-common-toolkit';

import { Injectable } from '@nestjs/common';

import { APP_ACTION } from '@shared/constants';
import { getLogId } from '@shared/decorators/logging.decorator';

@Injectable()
export abstract class OutboundPartnerService {
  constructor(
    protected readonly httpService: HttpService,
    protected readonly auditService: AuditService,
  ) {}

  protected abstract get baseUrl(): string;
  protected getDefaultOptions(): HttpRequestOption {
    return {};
  }
  async request<T = any>(
    method: HttpMethod,
    path: string,
    payload?: any,
    emitAudit: boolean = true,
  ): Promise<HttpResponse<T>> {
    const url = `${this.baseUrl}${path}`;
    const options = this.buildRequestOptions(method, payload);

    try {
      const res = await this.httpService.send<T>(method, url, options);

      if (!res?.success || !res?.data) {
        this.handleError(res, method, url, payload, options, emitAudit);
        return this.fail(res);
      }

      return { success: true, data: res.data };
    } catch (err) {
      this.handleError(err, method, url, payload, options, emitAudit);
      return {
        success: false,
        message: 'Partner request exception',
      };
    }
  }

  private buildRequestOptions(
    method: HttpMethod,
    payload?: any,
  ): HttpRequestOption {
    const options = this.getDefaultOptions();

    if (['post', 'put', 'patch'].includes(method)) {
      options.body = payload;
    } else if (method === 'get') {
      options.query = payload;
    }

    return options;
  }

  private handleError(
    error: any,
    method: HttpMethod,
    url: string,
    payload: any,
    options: HttpRequestOption,
    emitAudit: boolean,
  ) {
    if (!emitAudit) return;

    this.auditService.emitLog(
      new ErrorLog({
        logId: getLogId(options),
        message: error?.message,
        action: APP_ACTION.SEND_TO_PARTNER,
        payload: JSON.stringify(payload, stringUtils.maskFn),
        metadata: {
          url,
          method,
          response: JSON.stringify(error, stringUtils.maskFn),
        },
      }),
    );
  }

  private fail(res?: HttpResponse): HttpResponse {
    return {
      success: false,
      message: res?.message || 'Partner request failed',
      code: res?.code,
      httpCode: res?.httpCode,
    };
  }
}
