import { ApiProperty } from '@nestjs/swagger';

export class ModelSummaryDto {
  @ApiProperty({
    description: 'Total number of models',
    example: 10,
  })
  total_models: number;

  @ApiProperty({
    description: 'Number of active models',
    example: 8,
  })
  active_models: number;

  @ApiProperty({
    description: 'Number of inactive models',
    example: 2,
  })
  inactive_models: number;

  @ApiProperty({
    description: 'Total number of model versions',
    example: 56200,
  })
  total_versions: number;

  @ApiProperty({
    description: 'Number of failed models',
    example: 2,
  })
  failed_models: number;
}

export class ModelItemDto {
  @ApiProperty({
    description: 'Model ID',
    example: 'VCB',
  })
  id: string;

  @ApiProperty({
    description: 'Model name',
    example: 'VCB LSTM Predictor',
  })
  name: string;

  @ApiProperty({
    description: 'Model version',
    example: 'v1.0.0',
  })
  version: string;

  @ApiProperty({
    description: 'Model type',
    example: 'Time Series',
  })
  type: string;

  @ApiProperty({
    description: 'Model status',
    example: 'running',
  })
  status: string;

  @ApiProperty({
    description: 'Model environment',
    example: 'production',
  })
  environment: string;
  updated_at: string;
}

export class ModelDetailDto extends ModelItemDto {
  @ApiProperty({
    description: 'Model metadata',
    example: {
      description: 'LSTM model for VCB stock price prediction.',
      author: 'System',
    },
  })
  metadata: Record<string, any>;

  @ApiProperty({
    description: 'Model metrics',
    example: {},
  })
  metrics: Record<string, any>;

  @ApiProperty({
    description: 'Model training information',
    example: {
      last_trained: '2026-04-25T14:00:00Z',
      file_size: '0.12MB',
    },
  })
  training_info: Record<string, any>;

  @ApiProperty({
    description: 'Model deployment history',
    example: [
      {
        version: 'v1.0.0',
        deployed_at: '2026-04-25T14:00:00Z',
        environment: 'production',
        status: 'success',
      },
    ],
  })
  deploy_history: Record<string, any>[];
}

export class ModelActionResponseDto {
  @ApiProperty({
    description: 'If the action was successful',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Response message',
    example: 'Model deployed successfully',
  })
  message: string;
  data?: Record<string, any>;
}

export class ModelVersionDto {
  @ApiProperty({
    description: 'Model version ID',
    example: 'v1',
  })
  id: string;

  @ApiProperty({
    description: 'Model version',
    example: 'v1.0.0',
  })
  version: string;

  @ApiProperty({
    description: 'Model version deployed at',
    example: '2026-04-25T14:00:00Z',
  })
  deployed_at: string;

  @ApiProperty({
    description: 'Model version status',
    example: 'active',
  })
  status: string;
}
