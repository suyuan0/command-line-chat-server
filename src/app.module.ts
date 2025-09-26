import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

interface DBInterface {
  DB_HOST: string;
  DB_PORT: number;
  DB_USER: string;
  DB_PASSWD: string;
  DB_DATABASE: string;
  NODE_ENV: string;
}

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<DBInterface>) => {
        return {
          type: 'mysql',
          entities: [],
          host: configService.get('DB_HOST'),
          port: configService.get('DB_PORT'),
          username: configService.get('DB_USER'),
          password: configService.get('DB_PASSWD'),
          database: configService.get('DB_DATABASE'),
          timezone: '+08:00',
          synchronize: configService.get('NODE_ENV') === 'development',
        };
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
