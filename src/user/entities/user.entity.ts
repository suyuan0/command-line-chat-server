import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn({ type: 'int', comment: '用户ID' })
  id: number;

  @Column({ type: 'varchar', length: 20, comment: '用户名称' })
  username: string;

  @Column({ type: 'varchar', length: 30, comment: '用户邮箱地址' })
  email: string;

  @Column({ type: 'varchar', comment: '用户密码' })
  password: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: false,
    comment: '哈希加密的盐',
  })
  salt: string;
}
