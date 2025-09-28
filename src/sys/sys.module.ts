import { Module } from '@nestjs/common';
import { SysService } from './sys.service';
import { SysController } from './sys.controller';
import { MailService } from 'src/common/mail/mail.service';

@Module({
  controllers: [SysController],
  providers: [SysService, MailService],
})
export class SysModule {}
