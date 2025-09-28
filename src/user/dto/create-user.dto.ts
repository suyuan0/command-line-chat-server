import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: '邮箱不能为空' })
  @IsString({ message: '邮箱必须为string类型' })
  @IsEmail()
  email: string;

  @IsNotEmpty({ message: '用户名不能为空' })
  @IsString({ message: '用户名必须为string类型' })
  username: string;

  @IsNotEmpty({ message: '密码不能为空' })
  @IsString({ message: '密码必须为string类型' })
  password: string;

  @IsNotEmpty({ message: '验证码不能为空' })
  code: string;
}
