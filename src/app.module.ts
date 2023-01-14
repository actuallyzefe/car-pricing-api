import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ReportsModule } from './reports/reports.module';
import { UsersModule } from './users/users.module';
import { UsController } from './us/us.controller';

@Module({
  imports: [ReportsModule, UsersModule],
  controllers: [AppController, UsController],
  providers: [AppService],
})
export class AppModule {}
