import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigModule } from '@nestjs/config';
import * as Joi from "joi"
import { DatabaseModule } from '@app/common/database/database.module';
import { UsersModule } from './users/users.module';
import { JwtStrategy } from './strategy';
import { JwtUtilsModule } from '@app/common/jwt/jwt-utils.module';
import { HashModule, authProviders } from '@app/common';
import { LoggerMiddleware } from '@app/common/middlewares';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    validationSchema: Joi.object({
      MONGODB_URI: Joi.string().required(),
      PORT: Joi.number().required(),
      JWT_SECRET: Joi.string().required()
    }),
    envFilePath: './apps/auth/.env',
  }),
    DatabaseModule,
    UsersModule,
    HashModule,
    JwtUtilsModule
  ],
  controllers: [AuthController],
  providers: [
    ...authProviders,
    AuthService,
    JwtStrategy
  ],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('*');
  }
}
