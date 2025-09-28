import { Controller, Get, Query } from '@nestjs/common';
import { SysService } from './sys.service';

@Controller('sys')
export class SysController {
  constructor(private readonly sysService: SysService) {}

  @Get('sendEmailForRegistry')
  sendEmailForRegistry(@Query() dto: { email: string }) {
    return this.sysService.sendMailForRegistry(dto.email, '注册验证码');
  }
}
