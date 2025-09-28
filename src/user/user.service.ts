import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { compare } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { genSalt, hash } from 'bcryptjs';
import { plainToInstance } from 'class-transformer';
import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UserEntity } from './entities/user.entity';
import { getRedisKey } from 'src/common/utils';
import { RedisKeyPrefix } from 'src/common/enums/redis-key.enum';
import { RedisService } from 'src/common/redis/redis.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private jwtService: JwtService,
    private redisService: RedisService,
  ) {}

  async registry(createUserDto: CreateUserDto) {
    const user = await this.userRepository.findOne({
      where: {
        email: createUserDto.email,
      },
    });

    if (user) {
      throw new HttpException('该邮箱账户已经存在', HttpStatus.CONFLICT);
    }
    // 校验注册验证码
    const codeRedisKey = getRedisKey(
      RedisKeyPrefix.REGISTRY_CODE,
      createUserDto.email,
    );
    const code = await this.redisService.get(codeRedisKey);
    if (!code || code !== createUserDto.code) {
      throw new HttpException(
        '验证码有误或已过期',
        HttpStatus.EXPECTATION_FAILED,
      );
    }
    // 哈希加密
    const salt = await genSalt();
    createUserDto.password = await hash(createUserDto.password, salt);

    const newUser = plainToInstance(
      UserEntity,
      { salt, ...createUserDto },
      { ignoreDecorators: true },
    );

    const {
      password: _password,
      salt: _salt,
      ...rest
    } = await this.userRepository.save(newUser);
    const redisKey = getRedisKey(RedisKeyPrefix.USER_INFO, rest.id);
    await this.redisService.hSet(redisKey, rest);
    const emailKey = getRedisKey(
      RedisKeyPrefix.REGISTRY_CODE,
      createUserDto.email,
    );
    await this.redisService.del(emailKey);
    return rest;
  }

  /**
   * 登录
   * @param loginUserDto
   * @returns
   */
  async login(loginUserDto: LoginUserDto) {
    const user = await this.userRepository.findOne({
      where: {
        email: loginUserDto.email,
      },
    });

    if (!user) {
      throw new HttpException('邮箱账户不存在', HttpStatus.EXPECTATION_FAILED);
    }

    const checkPassword = await compare(loginUserDto.password, user.password);
    if (!checkPassword) {
      throw new HttpException('账号或密码错误', HttpStatus.EXPECTATION_FAILED);
    }

    const { password: _password, ...rest } = user;
    const access_token = this.generateAccessToken(rest);
    return { access_token };
  }

  generateAccessToken(payload: Record<string, any>): string {
    return this.jwtService.sign(payload);
  }
}
