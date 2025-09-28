import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserEntity } from './entities/user.entity';
import { MailService } from 'src/common/mail/mail.service';
import { RedisModule } from 'src/common/redis/redis.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRE_TIME'),
        },
      }),
      inject: [ConfigService],
    }),
    RedisModule,
  ],
  controllers: [UserController],
  providers: [UserService, MailService],
})
export class UserModule {}
