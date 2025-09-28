import { Injectable, Inject } from '@nestjs/common';
import { getRedisKey } from 'src/common/utils';
import { RedisKeyPrefix } from 'src/common/enums/redis-key.enum';
import { MailService } from 'src/common/mail/mail.service';
import { RedisService } from 'src/common/redis/redis.service';

@Injectable()
export class SysService {
  @Inject(MailService)
  private mailService: MailService;

  @Inject(RedisService)
  private redisService: RedisService;

  async sendMailForRegistry(email: string, text: string) {
    const { code } = await this.mailService.sendMail(email, text);

    // 缓存redis
    const redisKey = getRedisKey(RedisKeyPrefix.REGISTRY_CODE, email);
    await this.redisService.set(redisKey, code, 60 * 5);
    return '发送成功';
  }
}
