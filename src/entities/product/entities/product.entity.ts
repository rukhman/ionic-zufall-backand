import { User } from 'src/entities/user/entities/user.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name', type: 'varchar' })
  name: string;

  @Column({ name: 'description', type: 'text', nullable: true })
  description: string;

  @Column({ name: 'city', type: 'varchar' })
  city: string;

  @Column({ name: 'price', type: 'varchar' })
  price: string;

  @Column({ name: 'sale', type: 'varchar', nullable: true })
  sale: string;

  @Column({ name: 'sale_type', type: 'varchar', nullable: true })
  saleType: string;

  @Column({ name: 'create_date', type: 'timestamp', nullable: true })
  createDate: Date;

  @Column({ name: 'update_date', type: 'timestamp', nullable: true })
  updateDate: Date;

  @Column('simple-array')
  photos: string[];

  @ManyToMany(() => User, (user) => user.events, { cascade: true })
  users: User[];
}
