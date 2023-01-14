import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ReportsModule } from './reports/reports.module';
import { User } from './users/user.entity';
import { UsersModule } from './users/users.module';

@Module({
  // TypeOrm i import içerisine yazdıktan sonra .forRoot() fonksıyonu kullanırız ve bu da içerisine çeşitli optionlar alır
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite', // kullandıgımız database
      database: 'db.sqlite',
      entities: [User],
      synchronize: true,
    }),
    ReportsModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
