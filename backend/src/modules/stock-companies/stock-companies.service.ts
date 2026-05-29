import { OperationResult } from 'mvc-common-toolkit';
import { Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { BaseCRUDService } from '@shared/services/base-crud.service';

import { StockCompanies } from './stock-companies.model';

@Injectable()
export class StockCompaniesService extends BaseCRUDService<StockCompanies> {
  constructor(
    @InjectRepository(StockCompanies)
    protected repo: Repository<StockCompanies>,
  ) {
    super(repo);
  }

  public async getAll(): Promise<OperationResult> {
    const stockCompanies = await this.findAll(undefined, {
      select: {
        symbol: true,
        organizationName: true,
      },
    });

    return {
      success: true,
      data: stockCompanies,
    };
  }
}
