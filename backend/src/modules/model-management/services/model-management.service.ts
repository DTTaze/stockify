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
  ModelActionResponseDto,
  ModelDetailDto,
  ModelItemDto,
  ModelSummaryDto,
  ModelVersionDto,
} from '../dto/model-management.dto';

@Injectable()
export class ModelManagementService extends OutboundPartnerService {
  private readonly logger = new Logger(ModelManagementService.name);

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

  public async getModelSummary(): Promise<OperationResult<ModelSummaryDto>> {
    return this.request<ModelSummaryDto>(
      'get',
      '/model-management/summary',
    ) as any;
  }

  public async getModels(): Promise<OperationResult<ModelItemDto[]>> {
    return this.request<ModelItemDto[]>(
      'get',
      '/model-management/models',
    ) as any;
  }

  public async getModelDetail(
    id: string,
  ): Promise<OperationResult<ModelDetailDto>> {
    return this.request<ModelDetailDto>(
      'get',
      `/model-management/models/${id}`,
    ) as any;
  }

  public async deployModel(
    id: string,
  ): Promise<OperationResult<ModelActionResponseDto>> {
    return this.request<ModelActionResponseDto>(
      'post',
      `/model-management/deploy/${id}`,
    ) as any;
  }

  public async rollbackModel(
    id: string,
  ): Promise<OperationResult<ModelActionResponseDto>> {
    return this.request<ModelActionResponseDto>(
      'post',
      `/model-management/rollback/${id}`,
    ) as any;
  }

  public async restartModel(
    id: string,
  ): Promise<OperationResult<ModelActionResponseDto>> {
    return this.request<ModelActionResponseDto>(
      'post',
      `/model-management/restart/${id}`,
    ) as any;
  }

  public async deleteModel(
    id: string,
  ): Promise<OperationResult<ModelActionResponseDto>> {
    return this.request<ModelActionResponseDto>(
      'delete',
      `/model-management/${id}`,
    ) as any;
  }

  public async getModelVersions(
    id: string,
  ): Promise<OperationResult<ModelVersionDto[]>> {
    return this.request<ModelVersionDto[]>(
      'get',
      `/model-management/${id}/versions`,
    ) as any;
  }
}
