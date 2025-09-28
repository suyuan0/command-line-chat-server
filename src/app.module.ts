import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { SysModule } from './sys/sys.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'mysql',
          host: configService.get('DB_HOST'),
          port: configService.get('DB_PORT'),
          username: configService.get('DB_USER'),
          password: configService.get('DB_PASSWD'),
          database: configService.get('DB_DATABASE'),
          timezone: '+08:00',
          // entities: [__dirname + '/../**/*.entity.{.ts,.js}'],
          autoLoadEntities: true,
          synchronize: configService.get('NODE_ENV') === 'development',
        };
      },
    }),
    UserModule,
    SysModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
