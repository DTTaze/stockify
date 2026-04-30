import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Role } from '@modules/user/entities/role.entity';
import { UserRole } from '@modules/user/entities/user-role.entity';
import { RolesService } from '@modules/user/services/role.service';
import { UserRolesService } from '@modules/user/services/user-role.service';

import { UserController } from './controllers/user.controller';
import { User } from './entities/user.entity';
import { UserService } from './services/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role, UserRole])],
  controllers: [UserController],
  providers: [UserService, UserRolesService, RolesService],
  exports: [UserService, UserRolesService, RolesService],
})
export class UserModule {}
