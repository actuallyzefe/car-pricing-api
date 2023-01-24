import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';
import { UsersService } from './users.service';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(email: string, passowrd: string) {
    // Check if the email is valid
    const users = await this.usersService.find(email);
    if (users.length) {
      // bu array oldugu ıcın bu emaile sahip başka kullanıcı olmaması gerek eger varsa da error gonderıyoruz
      throw new BadRequestException('Email in use');
    }

    // Encrpyt da password // Hash da passowrd
    // Genereate a Salt
    const salt = randomBytes(8).toString('hex');

    // Hash the salt and the password together
    const hash = (await scrypt(passowrd, salt, 32)) as Buffer; // neylerın hashlenecegıne ilk 2 argumanda belırttık 3. arguman oalrak kac bytleık bır hash olacagını belırttık
    // typescript in daha rahat anlaması ıcın = sonrası her seyı paranteze alıp as Buffer olarak markladık

    // Join the hashed result and salt together
    const result = salt + '.' + hash.toString('hex');

    // Store the new user
    const user = this.usersService.create(email, result); // using await ???

    // Send back a cookie that contains user's id
    return user;
  }

  async signin(email: string, passowrd: string) {
    const [user] = await this.usersService.find(email); // find methodu birçok email adresi return ediyordu ondan dolayı user ı [] belirttik
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // compare passwords
    const [salt, storedHash] = user.password.split('.');
    const hash = (await scrypt(passowrd, salt, 32)) as Buffer;

    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('Bad password');
    }
    return user;
  }
}
