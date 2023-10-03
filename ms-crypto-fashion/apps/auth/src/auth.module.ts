import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from "joi"
import { DatabaseModule } from '@app/common/database/database.module';
import { UsersModule } from './users/users.module';
// import { JwtStrategy } from './strategy';
import { JwtUtilsModule } from '@app/common/jwt/jwt-utils.module';
import { HashModule, RmqModule, authProviders } from '@app/common';
import { LoggerMiddleware } from '@app/common/middlewares';
import { AUTH_SERVICE } from '@app/common/constants';
import { JwtStrategy } from '@app/common/strategy';
import { PermissionModule } from './permission/permission.module';
import { AddressModule } from './address/address.module';
import { GoogleStrategy } from './shared/google.strategy';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().required(),
        PORT: Joi.number().required(),
        JWT_SECRET: Joi.string().required(),
        RABBIT_MQ_URL: Joi.string().required(),
      }),
      envFilePath: './apps/auth/.env',
    }),
    MailerModule.forRootAsync({
      // imports: [ConfigModule], // import module if not enabled globally
      useFactory: async (config: ConfigService) => ({
        // transport: config.get("MAIL_TRANSPORT"),
        // or
        transport: {
          host: config.get<string>('MAIL_HOST'),
          secure: false,
          auth: {
            user: config.get<string>('MAIL_USER'),
            pass: config.get<string>('MAIL_PASSWORD'),
          },
        }
      }),
      inject: [ConfigService],
    }),
    DatabaseModule,
    UsersModule,
    HashModule,
    JwtUtilsModule,
    PermissionModule,
    AddressModule
    // RmqModule
  ],
  controllers: [AuthController],
  providers: [
    ...authProviders,
    AuthService,
    JwtStrategy,
    GoogleStrategy
  ],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('*');
  }
}
