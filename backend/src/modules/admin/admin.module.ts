import { Module } from '@nestjs/common';

import { UserModule } from '@modules/user/user.module';

import { AdminRolesController } from './controllers/admin-roles.controller';
import { AdminUserRolesController } from './controllers/admin-user-roles.controller';
import { AdminController } from './controllers/admin.controller';
import { AdminRolesService } from './services/admin-roles.service';
import { AdminUserRolesService } from './services/admin-user-roles.service';

@Module({
  imports: [UserModule],
  controllers: [
    AdminController,
    AdminRolesController,
    AdminUserRolesController,
  ],
  providers: [AdminRolesService, AdminUserRolesService],
})
export class AdminModule {}
