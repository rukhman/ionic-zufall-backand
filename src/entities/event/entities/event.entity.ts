import { User } from 'src/entities/user/entities/user.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name', type: 'varchar' })
  name: string;

  @Column({ name: 'description', type: 'text', nullable: true })
  description: string;

  @Column({ name: 'city', type: 'varchar' })
  city: string;

  @Column({ name: 'create_date', type: 'timestamp', nullable: true })
  createDate: Date;

  @Column({ name: 'update_date', type: 'timestamp', nullable: true })
  updateDate: Date;

  @Column('simple-array')
  photos: string[];

  @ManyToMany(() => User, (user) => user.events, { cascade: true })
  users: User[];

  // @ManyToOne(() => User, (user) => user.events)
  // user: User;
}
