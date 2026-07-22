import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './config/database.config';
import { AuditLogsModule } from './modules/audit-logs/audit-logs.module';
import { PermissionsModule } from './modules/permissions/permissions.module';
import { RolesModule } from './modules/roles/roles.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { OrganizationsModule } from './modules/organizations/organizations.module';
import { JwtAuthGuard } from './modules/auth/guards/jwt-auth.guard';
import { StrategicPlansModule } from './modules/strategic-plans/strategic-plans.module';
import { ProgramsModule } from './modules/programs/programs.module';
import { ObjectivesModule } from './modules/objectives/objectives.module';
import { ResultsModule } from './modules/results/results.module';
import { ActivitiesModule } from './modules/activities/activities.module';
import { IndicatorsModule } from './modules/indicators/indicators.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { ProjectObjectivesModule } from './modules/project-objectives/project-objectives.module';
import { ProjectResultsModule } from './modules/project-results/project-results.module';
import { ProjectActivitiesModule } from './modules/project-activities/project-activities.module';
import { ProjectIndicatorsModule } from './modules/project-indicators/project-indicators.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(databaseConfig),
    UsersModule,
    RolesModule,
    PermissionsModule,
    AuditLogsModule,
    OrganizationsModule,
    AuthModule,
    StrategicPlansModule,
    ProgramsModule,
    ObjectivesModule,
    ResultsModule,
    ActivitiesModule,
    IndicatorsModule,
    ProjectsModule,
    ProjectObjectivesModule,
    ProjectResultsModule,
    ProjectActivitiesModule,
    ProjectIndicatorsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
