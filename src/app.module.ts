import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Report } from './reports/report.entity';
import { ReportsModule } from './reports/reports.module';
import { User } from './users/user.entity';
import { UsersModule } from './users/users.module';

@Module({
  // TypeOrm i import içerisine yazdıktan sonra .forRoot() fonksıyonu kullanırız ve bu da içerisine çeşitli optionlar alır
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite', // kullandıgımız database
      database: 'db.sqlite',
      entities: [User, Report], // repo
      synchronize: true, // Otomatik olarak migration yazmamızı sağlar (otomatik oalrak table ı gunceller -- column ekler - siler vesaire)
      // IMPORTANT developement modda bu gayet yardımcı fakat production modda bunu kullanmamalıyız! Migration dosyaları yazmalıyız
    }),
    ReportsModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
