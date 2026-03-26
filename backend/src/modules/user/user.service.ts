import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from './user.model';

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
      passwordHash: hashedPassword,
      fullName: data.fullName,
      role: 'USER',
      status: 'ACTIVE',
    } as Partial<User>);

    return this.repo.save(user);
  }

  async findByEmail(email: string) {
    return this.repo.findOne({ where: { email } });
  }

  async validateUser(email: string, password: string) {
    const user = await this.findByEmail(email);

    if (!user) return null;

    const isMatch = await bcrypt.compare(password, user.password); // ✅

    if (!isMatch) return null;

    return user;
  }

  async updatePassword(userId: string, newPassword: string) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.repo.update(userId, {
      password: hashedPassword,
    });

    return true;
  }
}
