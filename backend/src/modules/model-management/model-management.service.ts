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
} from './model-management.dto';

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
    try {
      const response = await this.httpService.send(
        'get',
        this.baseUrl + '/model-management/summary',
      );

      if (response.success) {
        return { success: true, data: response.data };
      }

      return {
        success: false,
        message: response.message || 'Failed to fetch summary',
      };
    } catch (error) {
      this.logger.error('Failed to fetch model summary', error);
      return { success: false, message: 'Failed to fetch summary' };
    }
  }

  public async getModels(): Promise<OperationResult<ModelItemDto[]>> {
    try {
      const response = await this.httpService.send(
        'get',
        this.baseUrl + '/model-management/models',
      );

      if (response.success) {
        return { success: true, data: response.data };
      }

      return {
        success: false,
        message: response.message || 'Failed to fetch models',
      };
    } catch (error) {
      this.logger.error('Failed to fetch models', error);
      return { success: false, message: 'Failed to fetch models' };
    }
  }

  public async getModelDetail(
    id: string,
  ): Promise<OperationResult<ModelDetailDto>> {
    try {
      const response = await this.httpService.send(
        'get',
        this.baseUrl + `/model-management/models/${id}`,
      );

      if (response.success) {
        return { success: true, data: response.data };
      }

      return {
        success: false,
        message: response.message || 'Failed to fetch model detail',
      };
    } catch (error) {
      this.logger.error(`Failed to fetch model detail for ${id}`, error);
      return { success: false, message: 'Failed to fetch model detail' };
    }
  }

  public async deployModel(
    id: string,
  ): Promise<OperationResult<ModelActionResponseDto>> {
    try {
      const response = await this.httpService.send(
        'post',
        this.baseUrl + `/model-management/deploy/${id}`,
      );

      if (response.success) {
        return { success: true, data: response.data };
      }

      return {
        success: false,
        message: response.message || 'Failed to deploy model',
      };
    } catch (error) {
      this.logger.error(`Failed to deploy model ${id}`, error);
      return { success: false, message: 'Failed to deploy model' };
    }
  }

  public async rollbackModel(
    id: string,
  ): Promise<OperationResult<ModelActionResponseDto>> {
    try {
      const response = await this.httpService.send(
        'post',
        this.baseUrl + `/model-management/rollback/${id}`,
      );

      if (response.success) {
        return { success: true, data: response.data };
      }

      return {
        success: false,
        message: response.message || 'Failed to rollback model',
      };
    } catch (error) {
      this.logger.error(`Failed to rollback model ${id}`, error);
      return { success: false, message: 'Failed to rollback model' };
    }
  }

  public async restartModel(
    id: string,
  ): Promise<OperationResult<ModelActionResponseDto>> {
    try {
      const response = await this.httpService.send(
        'post',
        this.baseUrl + `/model-management/restart/${id}`,
      );
      if (response.success) {
        return { success: true, data: response.data };
      }

      return {
        success: false,
        message: response.message || 'Failed to restart model',
      };
    } catch (error) {
      this.logger.error(`Failed to restart model ${id}`, error);
      return { success: false, message: 'Failed to restart model' };
    }
  }

  public async deleteModel(
    id: string,
  ): Promise<OperationResult<ModelActionResponseDto>> {
    try {
      const response = await this.httpService.send(
        'delete',
        this.baseUrl + `/model-management/${id}`,
      );

      if (response.success) {
        return { success: true, data: response.data };
      }

      return {
        success: false,
        message: response.message || 'Failed to delete model',
      };
    } catch (error) {
      this.logger.error(`Failed to delete model ${id}`, error);
      return { success: false, message: 'Failed to delete model' };
    }
  }

  public async getModelVersions(
    id: string,
  ): Promise<OperationResult<ModelVersionDto[]>> {
    try {
      const response = await this.httpService.send(
        'get',
        this.baseUrl + `/model-management/${id}/versions`,
      );

      if (response.success) {
        return { success: true, data: response.data };
      }

      return {
        success: false,
        message: response.message || 'Failed to fetch model versions',
      };
    } catch (error) {
      this.logger.error(`Failed to fetch model versions for ${id}`, error);
      return {
        success: false,
        message: 'Failed to fetch model versions',
      };
    }
  }
}
