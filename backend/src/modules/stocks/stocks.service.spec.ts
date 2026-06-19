import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { INJECTION_TOKEN } from '@shared/constants';

import { MLService } from '../ml/ml.service';
import { StockPrice } from './stock-price.model';
import { StocksClassificationSyncService } from './stocks-classification-sync.service';
import { StocksPriceSyncService } from './stocks-price-sync.service';
import { Stock } from './stocks.model';
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
});
