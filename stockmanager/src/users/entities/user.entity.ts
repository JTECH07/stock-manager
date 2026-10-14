import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  MAGASINIER = 'MAGASINIER',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column()
  password: string;

  @Column({
    type: 'varchar',
    length: 20,
    default: UserRole.MAGASINIER,
  })
  role: UserRole;

  @CreateDateColumn()
  createdAt: Date;
}
