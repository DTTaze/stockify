import { HttpResponse } from 'mvc-common-toolkit';

import { Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

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
    return this.modelManagementService.getModelSummary();
  }

  @Get('models')
  @ApiOperation({
    summary: 'Get all models',
  })
  async getModels(): Promise<HttpResponse> {
    return this.modelManagementService.getModels();
  }

  @Get('models/:id')
  @ApiOperation({ summary: 'Get model detail' })
  async getModelDetail(@Param('id') id: string): Promise<HttpResponse> {
    return this.modelManagementService.getModelDetail(id);
  }

  @Post('deploy/:id')
  @ApiOperation({ summary: 'Deploy model' })
  async deployModel(@Param('id') id: string): Promise<HttpResponse> {
    return this.modelManagementService.deployModel(id);
  }

  @Post('rollback/:id')
  @ApiOperation({ summary: 'Rollback model' })
  async rollbackModel(@Param('id') id: string): Promise<HttpResponse> {
    return this.modelManagementService.rollbackModel(id);
  }

  @Post('restart/:id')
  @ApiOperation({ summary: 'Restart model' })
  async restartModel(@Param('id') id: string): Promise<HttpResponse> {
    return this.modelManagementService.restartModel(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete model' })
  async deleteModel(@Param('id') id: string): Promise<HttpResponse> {
    return this.modelManagementService.deleteModel(id);
  }

  @Get(':id/versions')
  @ApiOperation({ summary: 'Get model versions' })
  async getModelVersions(@Param('id') id: string): Promise<HttpResponse> {
    return this.modelManagementService.getModelVersions(id);
  }
}
