import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(email: string, password: string) {
    // See if email is in use
    const users = await this.usersService.find(email);
    if (users.length) {
      throw new BadRequestException('Email in use');
    }
    // Hash the users password
    //Generate a salt
    // const salt = randomBytes(8).toString('hex');
    // const salt = await bcrypt.genSalt();
    const saltOrRounds = 10;

    //Hash the salt and password together
    // const hash = (await scrypt(password, salt, 32)) as Buffer;
    const hash = await bcrypt.hash(password, saltOrRounds);
    console.log(hash);
    // Create a new user and save it
    const user = await this.usersService.create(email, hash);
    // return the user
    return user;
  }

  async signin(email: string, password: string) {
    const [user] = await this.usersService.find(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const storedHash = user.password;

    const isMatch = await bcrypt.compare(password, storedHash);
    console.log(isMatch);

    if (!isMatch) {
      throw new BadRequestException('bad password');
    }
    return user;
  }
}
