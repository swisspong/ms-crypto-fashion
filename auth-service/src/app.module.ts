import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtGuard } from './common/guards';
import { RolesGuard } from './common/guards/roles.guard';
import { PermissionsGuard } from './common/guards/permission.guards';
import { DutiesGuard } from './common/guards/duties.guard';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    MongooseModule.forRoot("mongodb://root:root@localhost:27017/ms_user?authSource=admin"), 
    UsersModule,
    AuthModule
  ],
  controllers: [
    AppController
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionsGuard
    },
    {
      provide: APP_GUARD,
      useClass: DutiesGuard
    },
    AppService
  ],
})
export class AppModule {}
