import { Module } from '@nestjs/common';

import { DataManagementModule } from '@modules/data-management/data-management.module';
import { ModelManagementModule } from '@modules/model-management/model-management.module';
import { StocksModule } from '@modules/stocks/stocks.module';
import { UserModule } from '@modules/user/user.module';

import { AdminRolesController } from './controllers/admin-roles.controller';
import { AdminUserRolesController } from './controllers/admin-user-roles.controller';
import { AdminController } from './controllers/admin.controller';
import { AdminDashboardService } from './services/admin-dashboard.service';
import { AdminRolesService } from './services/admin-roles.service';
import { AdminUserRolesService } from './services/admin-user-roles.service';

@Module({
  imports: [
    UserModule,
    ModelManagementModule,
    DataManagementModule,
    StocksModule,
  ],
  controllers: [
    AdminController,
    AdminRolesController,
    AdminUserRolesController,
  ],
  providers: [AdminDashboardService, AdminRolesService, AdminUserRolesService],
})
export class AdminModule {}
