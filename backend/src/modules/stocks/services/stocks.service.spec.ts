import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { MLService } from '@modules/ml/services/ml.service';

import { INJECTION_TOKEN } from '@shared/constants';

import { StockPrice } from '../entities/stock-price.model';
import { Stock } from '../entities/stocks.model';
import { StocksClassificationSyncService } from './stocks-classification-sync.service';
import { StocksPriceSyncService } from './stocks-price-sync.service';
import { StocksService } from './stocks.service';

describe('StocksService', () => {
  let service: StocksService;
  let classificationSyncService: StocksClassificationSyncService;
  let priceSyncService: StocksPriceSyncService;

  const mockStockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockPriceRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    upsert: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  const mockConfigService = {
    getOrThrow: jest.fn().mockReturnValue('http://localhost:8000'),
  };

  const mockHttpService = {};
  const mockAuditService = {};

  const mockMLService = {
    getMarketQuote: jest.fn(),
    getMarketHistory: jest.fn(),
    getSymbolsByExchange: jest.fn(),
  };

  const mockClassificationSyncService = {
    syncClassifications: jest.fn(),
    getClassificationSummary: jest.fn(),
    upsertStocksInChunks: jest.fn(),
  };

  const mockPriceSyncService = {
    saveHistoricalPrices: jest.fn(),
    syncTrainedStockPrices: jest.fn(),
    syncIndexPrices: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StocksService,
        {
          provide: getRepositoryToken(Stock),
          useValue: mockStockRepository,
        },
        {
          provide: getRepositoryToken(StockPrice),
          useValue: mockPriceRepository,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: INJECTION_TOKEN.HTTP_SERVICE,
          useValue: mockHttpService,
        },
        {
          provide: INJECTION_TOKEN.AUDIT_SERVICE,
          useValue: mockAuditService,
        },
        {
          provide: MLService,
          useValue: mockMLService,
        },
        {
          provide: StocksClassificationSyncService,
          useValue: mockClassificationSyncService,
        },
        {
          provide: StocksPriceSyncService,
          useValue: mockPriceSyncService,
        },
      ],
    }).compile();

    service = module.get<StocksService>(StocksService);
    classificationSyncService = module.get<StocksClassificationSyncService>(
      StocksClassificationSyncService,
    );
    priceSyncService = module.get<StocksPriceSyncService>(
      StocksPriceSyncService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('syncClassifications', () => {
    it('should forward to StocksClassificationSyncService', async () => {
      const mockResult = { success: true, message: 'Sync done' };
      mockClassificationSyncService.syncClassifications.mockResolvedValue(
        mockResult,
      );

      const result = await service.syncClassifications();
      expect(result).toEqual(mockResult);
      expect(classificationSyncService.syncClassifications).toHaveBeenCalled();
    });
  });

  describe('syncTrainedStockPrices', () => {
    it('should forward to StocksPriceSyncService', async () => {
      const mockResult = { success: true, message: 'Price Sync done' };
      mockPriceSyncService.syncTrainedStockPrices.mockResolvedValue(mockResult);

      const result = await service.syncTrainedStockPrices();
      expect(result).toEqual(mockResult);
      expect(priceSyncService.syncTrainedStockPrices).toHaveBeenCalled();
    });
  });

  describe('saveHistoricalPrices', () => {
    it('should forward to StocksPriceSyncService', async () => {
      const mockResult = { success: true };
      mockPriceSyncService.saveHistoricalPrices.mockResolvedValue(mockResult);

      const result = await service.saveHistoricalPrices('VCB', []);
      expect(result).toEqual(mockResult);
      expect(priceSyncService.saveHistoricalPrices).toHaveBeenCalledWith(
        'VCB',
        [],
      );
    });
  });

  describe('getStockQuote', () => {
    it('should retrieve quotes directly from local database', async () => {
      const mockPrices = [
        {
          symbol: 'VCB',
          close: 100000,
          volume: 50000,
          date: new Date('2026-06-20'),
        },
        {
          symbol: 'VCB',
          close: 95000,
          volume: 40000,
          date: new Date('2026-06-19'),
        },
      ] as StockPrice[];
      mockPriceRepository.find.mockResolvedValue(mockPrices);

      const result = await service.getStockQuote('VCB');
      expect(result.success).toBe(true);
      expect(result.data).toEqual({
        symbol: 'VCB',
        price: 100000,
        change_percent: 5.26, // ((100000 - 95000) / 95000) * 100
        volume: 50000,
      });
      expect(mockPriceRepository.find).toHaveBeenCalledWith({
        where: { symbol: 'VCB' },
        order: { date: 'DESC' },
        take: 2,
      });
    });
  });

  describe('getHistoricalPrices', () => {
    it('should retrieve history directly from queryBuilder', async () => {
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([
          { date: new Date('2026-06-19'), close: 95000, volume: 40000 },
          { date: new Date('2026-06-20'), close: 100000, volume: 50000 },
        ]),
      };
      mockPriceRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await service.getHistoricalPrices('VCB');
      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(2);
      expect(result.data![0].close).toBe(95000);
      expect(result.data![1].close).toBe(100000);
    });
  });
});
