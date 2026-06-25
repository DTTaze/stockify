import { OperationResult } from 'mvc-common-toolkit';
import { Repository } from 'typeorm';

import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { MLService } from '@modules/ml/services/ml.service';

import { QueryIcbDTO, QueryIcbStocksDTO } from '../dto/stocks.dto';
import { IcbIndustry } from '../entities/icb-industry.model';
import { StockGroupMapping } from '../entities/stock-group-mapping.model';
import { StockGroup } from '../entities/stock-group.model';
import { StockIcbMapping } from '../entities/stock-icb-mapping.model';
import { Stock } from '../entities/stocks.model';

@Injectable()
export class StockCategoriesService {
  private readonly logger = new Logger(StockCategoriesService.name);

  constructor(
    @InjectRepository(Stock)
    private readonly stockRepo: Repository<Stock>,

    @InjectRepository(StockGroup)
    private readonly groupRepo: Repository<StockGroup>,

    @InjectRepository(StockGroupMapping)
    private readonly groupMappingRepo: Repository<StockGroupMapping>,

    @InjectRepository(IcbIndustry)
    private readonly icbRepo: Repository<IcbIndustry>,

    @InjectRepository(StockIcbMapping)
    private readonly icbMappingRepo: Repository<StockIcbMapping>,

    private readonly mlService: MLService,
  ) {}

  public async getMarketGroups(): Promise<OperationResult<StockGroup[]>> {
    try {
      const groups = await this.groupRepo.find({ order: { id: 'ASC' } });
      return {
        success: true,
        data: groups,
      };
    } catch (error) {
      this.logger.error('Error fetching market groups:', error);
      return {
        success: false,
        message: `Failed to fetch market groups: ${error.message}`,
      };
    }
  }

  public async getIcbIndustries(
    query: QueryIcbDTO,
  ): Promise<OperationResult<any[]>> {
    try {
      const queryBuilder = this.icbRepo
        .createQueryBuilder('industry')
        .leftJoin(StockIcbMapping, 'mapping', 'mapping.icbCode = industry.code')
        .select('industry.code', 'code')
        .addSelect('industry.name', 'name')
        .addSelect('industry.enName', 'enName')
        .addSelect('industry.level', 'level')
        .addSelect('COUNT(mapping.id)', 'stockCount')
        .groupBy('industry.code')
        .addGroupBy('industry.name')
        .addGroupBy('industry.enName')
        .addGroupBy('industry.level')
        .orderBy('industry.code', 'ASC');

      if (query.level) {
        queryBuilder.where('industry.level = :level', { level: query.level });
      }

      const rows = await queryBuilder.getRawMany();
      const results = rows.map((r) => ({
        code: r.code,
        name: r.name,
        enName: r.enName,
        level: parseInt(r.level, 10),
        stockCount: parseInt(r.stockCount, 10) || 0,
      }));

      return {
        success: true,
        data: results,
      };
    } catch (error) {
      this.logger.error('Error fetching ICB industries:', error);
      return {
        success: false,
        message: `Failed to fetch ICB industries: ${error.message}`,
      };
    }
  }

  public async getIcbStocks(
    icbCode: string,
    query: QueryIcbStocksDTO,
  ): Promise<OperationResult> {
    try {
      const queryBuilder = this.stockRepo
        .createQueryBuilder('stock')
        .innerJoin('stock.icbMappings', 'mapping')
        .where('mapping.icbCode = :icbCode', { icbCode });

      if (query.keyword) {
        const keyword = `%${query.keyword.trim().toUpperCase()}%`;
        queryBuilder.andWhere(
          '(stock.symbol LIKE :keyword OR stock.name LIKE :keyword)',
          { keyword },
        );
      }

      queryBuilder
        .skip(query.offset || 0)
        .take(query.limit || 10)
        .orderBy('stock.symbol', 'ASC');

      const [rows, total] = await queryBuilder.getManyAndCount();

      return {
        success: true,
        data: {
          rows,
          total,
          limit: query.limit || 10,
          offset: query.offset || 0,
        },
      };
    } catch (error) {
      this.logger.error(`Error fetching stocks for ICB ${icbCode}:`, error);
      return {
        success: false,
        message: `Failed to fetch stocks for ICB: ${error.message}`,
      };
    }
  }

  public async getTickerCategories(ticker: string): Promise<OperationResult> {
    try {
      const symbol = ticker.toUpperCase();
      const stock = await this.stockRepo.findOne({
        where: { symbol },
        relations: [
          'mappings',
          'mappings.stockGroup',
          'icbMappings',
          'icbMappings.icbIndustry',
        ],
      });

      if (!stock) {
        return {
          success: false,
          message: `Ticker ${ticker} not found`,
        };
      }

      const marketGroups = stock.mappings.map((m) => ({
        code: m.stockGroup.code,
        name: m.stockGroup.name,
      }));

      const icbIndustries = stock.icbMappings.map((m) => ({
        code: m.icbIndustry.code,
        name: m.icbIndustry.name,
        enName: m.icbIndustry.enName,
        level: m.icbIndustry.level,
      }));

      return {
        success: true,
        data: {
          symbol: stock.symbol,
          name: stock.name,
          exchange: stock.exchange,
          marketGroups,
          icbIndustries,
        },
      };
    } catch (error) {
      this.logger.error(
        `Error fetching categories for ticker ${ticker}:`,
        error,
      );
      return {
        success: false,
        message: `Failed to fetch ticker categories: ${error.message}`,
      };
    }
  }

  public async syncIcbIndustries(): Promise<OperationResult> {
    try {
      this.logger.log(
        'Starting sync of ICB Industries from Python microservice...',
      );

      // 1. Fetch industries structure from FastAPI
      const industryResponse = await this.mlService.getIcbIndustries();
      if (!industryResponse.success || !industryResponse.data) {
        return {
          success: false,
          message: 'Failed to fetch ICB industries from ML service',
        };
      }

      const rawIndustries = industryResponse.data;
      this.logger.log(
        `Fetched ${rawIndustries.length} industries from ML. Saving to DB...`,
      );

      const entities: IcbIndustry[] = rawIndustries.map((item) => {
        const ind = new IcbIndustry();
        ind.code = item.icb_code;
        ind.name = item.icb_name;
        ind.enName = item.en_icb_name;
        ind.level = item.level;
        return ind;
      });

      // Upsert industries in chunks of 50
      const chunkSize = 50;
      for (let i = 0; i < entities.length; i += chunkSize) {
        await this.icbRepo.upsert(entities.slice(i, i + chunkSize), ['code']);
      }

      // 2. Fetch stock-to-industry mappings from FastAPI
      const mappingResponse = await this.mlService.getSymbolsByIndustries();
      if (!mappingResponse.success || !mappingResponse.data) {
        return {
          success: false,
          message: 'Failed to fetch symbols by industries from ML service',
        };
      }

      const rawMappings = mappingResponse.data;
      this.logger.log(
        `Fetched ${rawMappings.length} mappings from ML. Saving to DB...`,
      );

      // Get all active stock symbols currently in database
      const allStocks = await this.stockRepo.find({ select: ['symbol'] });
      const stockSymbols = new Set(
        allStocks.map((s) => s.symbol.toUpperCase()),
      );

      const mappingEntities: StockIcbMapping[] = [];
      for (const item of rawMappings) {
        const sym = item.symbol.toUpperCase();
        if (stockSymbols.has(sym)) {
          const mapEnt = new StockIcbMapping();
          mapEnt.stockSymbol = sym;
          mapEnt.icbCode = item.icb_code;
          mappingEntities.push(mapEnt);
        }
      }

      // Clear existing mappings
      await this.icbMappingRepo.clear();

      // Save new mappings in chunks of 200
      const mapChunkSize = 200;
      for (let i = 0; i < mappingEntities.length; i += mapChunkSize) {
        await this.icbMappingRepo.save(
          mappingEntities.slice(i, i + mapChunkSize),
        );
      }

      return {
        success: true,
        message: 'Synced ICB Industries successfully',
        data: {
          industriesCount: entities.length,
          mappingsCount: mappingEntities.length,
        },
      };
    } catch (error) {
      this.logger.error('Error syncing ICB industries:', error);
      return {
        success: false,
        message: `Failed to sync ICB industries: ${error.message}`,
      };
    }
  }

  private async getSymbolsByGroupCode(groupCode: string): Promise<string[]> {
    const mappings = await this.groupMappingRepo
      .createQueryBuilder('mapping')
      .innerJoin('mapping.stockGroup', 'sg')
      .where('sg.code = :groupCode', { groupCode })
      .select('mapping.stockSymbol', 'symbol')
      .orderBy('mapping.stockSymbol', 'ASC')
      .getRawMany();
    return mappings.map((m) => m.symbol);
  }

  public async getFutures(): Promise<OperationResult<string[]>> {
    try {
      const symbols = await this.getSymbolsByGroupCode('FU_INDEX');
      return {
        success: true,
        data: symbols,
      };
    } catch (error) {
      this.logger.error('Error fetching futures from DB:', error);
      return {
        success: false,
        message: `Failed to fetch futures: ${error.message}`,
      };
    }
  }

  public async getGovernmentBonds(): Promise<OperationResult<string[]>> {
    try {
      const symbols = await this.getSymbolsByGroupCode('FU_BOND');
      return {
        success: true,
        data: symbols,
      };
    } catch (error) {
      this.logger.error('Error fetching government bonds from DB:', error);
      return {
        success: false,
        message: `Failed to fetch government bonds: ${error.message}`,
      };
    }
  }

  public async getIndices(): Promise<OperationResult<string[]>> {
    try {
      const symbols = await this.getSymbolsByGroupCode('INDEX');
      return {
        success: true,
        data: symbols,
      };
    } catch (error) {
      this.logger.error('Error fetching indices from DB:', error);
      return {
        success: false,
        message: `Failed to fetch indices: ${error.message}`,
      };
    }
  }
}
