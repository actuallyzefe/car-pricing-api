import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  // <> => generic type(typescript) Bu repository nin Userlar için olacagını belırtıtk
  // @InjectRepositroy decarotoru ise generic type ı kullandıgımızdan dolayı kullanmak durumunda kaldık diyebiliriz.
  // Daha doğrusu User repositorysını bu constructor a eklenmesını sağlayan Decarotr diyebiliriz
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  create(email: string, password: string) {
    const user = this.repo.create({ email, password });
    return this.repo.save(user);
  }

  findOne(id: number) {
    if (!id) return null;
    return this.repo.findOneBy({ id });
  }

  find(email: string) {
    return this.repo.find({ where: { email: email } }); // where:{email} diye bırakabiliriz es6
  }

  async update(id: number, attrs: Partial<User>) {
    const user = await this.findOne(id);
    if (!user) throw new NotFoundException('User not found');

    Object.assign(user, attrs); // user da bulunan tum ozellıklerı gırılen degerlerle overwrite et
    return this.repo.save(user); // save to DB
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    if (!user) throw new NotFoundException('User not found');

    return this.repo.remove(user);
  }
}
