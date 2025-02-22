import { Permission } from 'src/entities/permission/entities/permission.entity';
import { User } from 'src/entities/user/entities/user.entity';
import { Column, Entity, PrimaryGeneratedColumn, JoinTable, ManyToMany } from 'typeorm';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 200, unique: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @ManyToMany(() => Permission)
  @JoinTable({
    name: 'roles-permissions',
    joinColumn: { name: 'roleId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'permissionId' },
  })
  permissions: Permission[];

  @ManyToMany(() => User, (user) => user.events, { cascade: true })
  users: User[];
}
