import { ILike, In, Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { PaginationDTO } from '@shared/common/pagination.dto';
import { BaseCRUDService } from '@shared/services/base-crud.service';

import { Role } from '../entities/role.entity';

@Injectable()
export class RolesService extends BaseCRUDService<Role> {
  constructor(
    @InjectRepository(Role)
    protected readonly repo: Repository<Role>,
  ) {
    super(repo);
  }

  public async findByName(name: string): Promise<Role | null> {
    return this.findOne({ name });
  }

  public async findByNames(names: string[]): Promise<Role[]> {
    if (!names?.length) {
      return [];
    }

    return this.repo.find({
      where: {
        name: In(names),
      },
    });
  }

  public async update(
    id: number | string,
    payload: Partial<Role>,
  ): Promise<Role | null> {
    return this.updateByID(id, payload);
  }

  public async delete(id: number | string): Promise<void> {
    return this.deleteByID(id);
  }
}
