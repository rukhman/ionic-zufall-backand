import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { E_AuthService, E_Gender } from '../types';
import { Event } from '../../event/entities/event.entity';
import { Role } from 'src/entities/role/entities/role.entity';
import { Product } from 'src/entities/product/entities/product.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'auth_id', type: 'varchar', unique: true })
  authId: number;

  @Column({ name: 'first_name', type: 'varchar', nullable: true })
  firstName: string;

  @Column({ name: 'second_name', type: 'varchar', nullable: true })
  secondName: string;

  @Column({ name: 'full_name', type: 'varchar', nullable: true })
  fullName: string;

  @Column({ name: 'email2', type: 'varchar' })
  email: string;

  @Column({ name: 'avatar_id', type: 'varchar', nullable: true })
  avatarId: string;

  @Column({ name: 'phone', type: 'varchar', nullable: true })
  phone: string;

  @Column({ name: 'birth_date', type: 'timestamp', nullable: true })
  birthDate: Date;

  @Column({ name: 'gender', type: 'enum', enum: E_Gender, nullable: true })
  gender: E_Gender;

  @Column({
    name: 'auth_service',
    type: 'enum',
    enum: E_AuthService,
    nullable: true,
  })
  authService: E_AuthService;

  @ManyToMany(() => Event, (event) => event.users)
  @JoinTable({
    name: 'users-events',
    joinColumn: { name: 'userAuthId', referencedColumnName: 'authId' },
    inverseJoinColumn: { name: 'eventId' },
  })
  events: Event[];

  @ManyToMany(() => Product, (product) => product.users)
  @JoinTable({
    name: 'products-events',
    joinColumn: { name: 'userAuthId', referencedColumnName: 'authId' },
    inverseJoinColumn: { name: 'productId' },
  })
  products: Product[];

  @ManyToMany(() => Role, (role) => role.users)
  @JoinTable({
    name: 'users-roles',
    joinColumn: { name: 'userAuthId', referencedColumnName: 'authId' },
    inverseJoinColumn: { name: 'roleId' },
  })
  roles: Role[];
}
