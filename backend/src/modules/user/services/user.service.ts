import * as bcrypt from 'bcrypt';
import { ILike, Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import {
  QueryUsersDTO,
  VerifyUniquenessUserDTO,
} from '@modules/user/dto/user.dto';
import { User } from '@modules/user/entities/user.entity';

import { ENTITY_STATUS, ERR_CODE } from '@shared/constants';
import { generateConflictResult } from '@shared/helpers/operation-result.helper';
import { parseSort } from '@shared/helpers/query.helper';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) {}

  async create(data: Partial<User>) {
    const user = this.repo.create(data);
    return this.repo.save(user);
  }

  async findOne(condition: Partial<User>) {
    return this.repo.findOne({ where: condition });
  }

  async findByID(id: string) {
    return this.repo.findOne({ where: { id } });
  }

  async updateByID(id: string, data: Partial<User>) {
    await this.repo.update(id, data);
    return true;
  }

  async createUser(data: {
    email: string;
    password: string;
    fullName?: string;
  }) {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = this.repo.create({
      email: data.email,
      password: hashedPassword,
      username: data.fullName,
      status: ENTITY_STATUS.ACTIVE,
    } as Partial<User>);

    return this.repo.save(user);
  }

  public async verifyUniquenessUser(dto: Partial<VerifyUniquenessUserDTO>) {
    const { email, username } = dto;

    if (email) {
      const existsEmail = await this.findOne({ email });

      if (existsEmail) {
        return generateConflictResult(
          'email already exists',
          ERR_CODE.EMAIL_ALREADY_EXISTS,
        );
      }
    }

    if (username) {
      const existsUsername = await this.findOne({ username });

      if (existsUsername) {
        return generateConflictResult(
          'username already exists',
          ERR_CODE.USERNAME_ALREADY_EXISTS,
        );
      }
    }

    return {
      success: true,
    };
  }

  async findByEmail(email: string) {
    return this.repo.findOne({ where: { email } });
  }

  async validateUser(email: string, password: string) {
    const user = await this.findByEmail(email);

    if (!user) {
      return null;
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return null;
    }

    return user;
  }

  async updatePassword(userId: string, newPassword: string) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.repo.update(userId, {
      password: hashedPassword,
    });

    return true;
  }

  async findAll() {
    return this.repo.find({
      where: [
        { status: ENTITY_STATUS.ACTIVE },
        { status: ENTITY_STATUS.SUSPENDED },
        { status: ENTITY_STATUS.INACTIVE },
      ],
      select: ['id', 'email', 'username', 'status', 'createdAt', 'updatedAt'],
      order: { createdAt: 'DESC' },
    });
  }

  async findPaginated(query: QueryUsersDTO) {
    const limit = query.limit || 10;
    const offset = query.offset || 0;
    const sort = query.sort || '-createdAt';
    const keyword = query.keyword;
    const status = query.status;

    const baseStatuses =
      status && Object.values(ENTITY_STATUS).includes(status)
        ? [status]
        : [
            ENTITY_STATUS.ACTIVE,
            ENTITY_STATUS.SUSPENDED,
            ENTITY_STATUS.INACTIVE,
          ];

    let where: any = baseStatuses.map((statusVal) => ({ status: statusVal }));

    if (keyword) {
      where = [];
      for (const statusVal of baseStatuses) {
        where.push({ status: statusVal, username: ILike(`%${keyword}%`) });
        where.push({ status: statusVal, email: ILike(`%${keyword}%`) });
      }
    }

    const parsedSort = parseSort(sort);

    const [rows, total] = await this.repo.findAndCount({
      where,
      relations: ['userRoles', 'userRoles.role'],
      order: parsedSort as any,
      take: limit,
      skip: offset,
    });

    const mappedRows = rows.map((user) => ({
      id: user.id,
      email: user.email,
      username: user.username,
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      roles: user.userRoles
        ? user.userRoles.map((ur) => ur.role?.name).filter(Boolean)
        : [],
      roleIds: user.userRoles
        ? user.userRoles.map((ur) => ur.role?.id).filter(Boolean)
        : [],
    }));

    const [activeCount, suspendedCount, inactiveCount] = await Promise.all([
      this.repo.count({ where: { status: ENTITY_STATUS.ACTIVE } }),
      this.repo.count({ where: { status: ENTITY_STATUS.SUSPENDED } }),
      this.repo.count({ where: { status: ENTITY_STATUS.INACTIVE } }),
    ]);

    return {
      rows: mappedRows,
      total,
      limit,
      offset,
      stats: {
        totalCount: activeCount + suspendedCount + inactiveCount,
        activeCount,
        suspendedCount,
      },
    };
  }

  async findRecentUsers(limit = 3) {
    return this.repo.find({
      where: [
        { status: ENTITY_STATUS.ACTIVE },
        { status: ENTITY_STATUS.SUSPENDED },
        { status: ENTITY_STATUS.INACTIVE },
      ],
      select: ['id', 'email', 'username', 'status', 'createdAt', 'updatedAt'],
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  async countActiveUsers() {
    return this.repo.count({
      where: {
        status: ENTITY_STATUS.ACTIVE,
      },
    });
  }
}
