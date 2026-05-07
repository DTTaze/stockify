import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AdminModule } from '@modules/admin/admin.module';
import { AuditModule } from '@modules/audit/audit.module';
import { AuthModule } from '@modules/auth/auth.module';
import { DataManagementModule } from '@modules/data-management/data-management.module';
import { GlobalModule } from '@modules/global/global.module';
import { MLModule } from '@modules/ml/ml.module';
import { ModelManagementModule } from '@modules/model-management/model-management.module';
import { StockCompaniesModule } from '@modules/stock-companies/stock-companies.module';
import { UserModule } from '@modules/user/user.module';
import { WatchlistModule } from '@modules/watchlist/watchlist.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mssql',

        host: config.get('DB_HOST'),
        port: parseInt(config.get('DB_PORT') || '1433'),
        username: config.get('DB_USERNAME'),
        password: config.get('DB_PASSWORD'),
        database: config.get('DB_NAME'),

        autoLoadEntities: true,
        synchronize: true,

        options: {
          encrypt: false,
          trustServerCertificate: true,
        },
      }),
    }),
    GlobalModule,
    AuditModule,
    UserModule,
    AuthModule,
    AdminModule,
    MLModule,
    DataManagementModule,
    ModelManagementModule,
    StockCompaniesModule,
    WatchlistModule,
  ],
})
export class AppModule {}
