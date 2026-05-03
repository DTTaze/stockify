import { HttpResponse } from 'mvc-common-toolkit';

import { Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { generateInternalServerResult } from '@shared/helpers/operation-result.helper';

import { ModelManagementService } from './model-management.service';

@ApiTags('Model Management')
@ApiBearerAuth()
@Controller('model-management')
export class ModelManagementController {
  constructor(protected modelManagementService: ModelManagementService) {}

  @Get('summary')
  @ApiOperation({
    summary: 'Get model dashboard summary',
  })
  async getModelSummary(): Promise<HttpResponse> {
    const result = await this.modelManagementService.getModelSummary();

    if (!result.success) {
      return generateInternalServerResult(result.message);
    }

    return { success: true, data: result.data };
  }

  @Get('models')
  @ApiOperation({
    summary: 'Get all models',
  })
  async getModels(): Promise<HttpResponse> {
    const result = await this.modelManagementService.getModels();

    if (!result.success) {
      return generateInternalServerResult(result.message);
    }

    return {
      success: true,
      data: result.data,
    };
  }

  @Get('models/:id')
  @ApiOperation({ summary: 'Get model detail' })
  async getModelDetail(@Param('id') id: string): Promise<HttpResponse> {
    const result = await this.modelManagementService.getModelDetail(id);

    if (!result.success) {
      return generateInternalServerResult(result.message);
    }

    return { success: true, data: result.data };
  }

  @Post('deploy/:id')
  @ApiOperation({ summary: 'Deploy model' })
  async deployModel(@Param('id') id: string): Promise<HttpResponse> {
    const result = await this.modelManagementService.deployModel(id);

    if (!result.success) return generateInternalServerResult(result.message);

    return { success: true, data: result.data };
  }

  @Post('rollback/:id')
  @ApiOperation({ summary: 'Rollback model' })
  async rollbackModel(@Param('id') id: string): Promise<HttpResponse> {
    const result = await this.modelManagementService.rollbackModel(id);

    if (!result.success) {
      return generateInternalServerResult(result.message);
    }

    return { success: true, data: result.data };
  }

  @Post('restart/:id')
  @ApiOperation({ summary: 'Restart model' })
  async restartModel(@Param('id') id: string): Promise<HttpResponse> {
    const result = await this.modelManagementService.restartModel(id);

    if (!result.success) {
      return generateInternalServerResult(result.message);
    }

    return { success: true, data: result.data };
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete model' })
  async deleteModel(@Param('id') id: string): Promise<HttpResponse> {
    const result = await this.modelManagementService.deleteModel(id);

    if (!result.success) {
      return generateInternalServerResult(result.message);
    }

    return {
      success: true,
      data: result.data,
    };
  }

  @Get(':id/versions')
  @ApiOperation({ summary: 'Get model versions' })
  async getModelVersions(@Param('id') id: string): Promise<HttpResponse> {
    const result = await this.modelManagementService.getModelVersions(id);

    if (!result.success) return generateInternalServerResult(result.message);

    return {
      success: true,
      data: result.data,
    };
  }
}
