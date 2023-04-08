import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  create(email: string, password: string) {
    const user = this.repo.create({ email, password });

    return this.repo.save(user);
  }

  findOne(id: number) {
    return this.repo.findOneBy({ id });
  }
  find(email: string) {
    const user = this.repo.find({ where: { email } });
    if (!user) throw new NotFoundException('NO USER FOUND');
    return user;
  }
  async update(id: number, attr: Partial<User>) {
    const user = await this.findOne(id);
    if (!user) return new NotFoundException('NO USER FOUND');

    Object.assign(user, attr);
    return this.repo.save(user);
  }
  async remove(id: number) {
    const user = await this.findOne(id);
    if (!user) return new NotFoundException('NO USER FOUND');

    return this.repo.remove(user);
  }
}
