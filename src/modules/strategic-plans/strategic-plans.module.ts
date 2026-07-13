import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StrategicPlan } from './entities/strategic-plan.entity';
import { StrategicPlansController } from './strategic-plans.controller';
import { StrategicPlansService } from './strategic-plans.service';
import { OrganizationsModule } from '../organizations/organizations.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([StrategicPlan]),
    OrganizationsModule,
  ],
  controllers: [StrategicPlansController],
  providers: [StrategicPlansService],
  exports: [StrategicPlansService],
})
export class StrategicPlansModule {}
