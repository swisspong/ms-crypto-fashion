import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigModule } from '@nestjs/config';
import * as Joi from "joi"
import { DatabaseModule } from '@app/common/database/database.module';
import { UsersModule } from './users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy';
import { APP_GUARD } from '@nestjs/core';
import { DutiesGuard } from './common/guards/duties.guard';
import { PermissionsGuard } from './common/guards/permission.guards';
import { RolesGuard } from './common/guards/roles.guard';
import { JwtGuard } from './common/guards';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    validationSchema: Joi.object({
      MONGODB_URI: Joi.string().required()
    }),
    envFilePath: './apps/auth/.env',

  }),
    DatabaseModule,
    UsersModule,
    JwtModule.register({}) 
  ],
  controllers: [AuthController],
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
    AuthService,
    JwtStrategy
  ],
})
export class AuthModule { }
