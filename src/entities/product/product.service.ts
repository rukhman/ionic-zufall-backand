import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
//

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  availableFields = ['id', 'name', 'description', 'city', 'photos'];

  // // Filter body's fileds from available fields list
  // private filterFields(body: { [k: string]: any }) {
  //   const filteredBody: { [k: string]: any } = {};

  //   Object.keys(body).filter((k) => {
  //     if (this.availableFields.includes(k)) {
  //       filteredBody[k] = body[k];
  //     }
  //   });

  //   return filteredBody;
  // }

  // Register new user
  public async createEvent(eventData: any) {
    const newUser = this.productRepository.create(eventData);
    return await this.productRepository.save(newUser);
  }

  public async getAllEvents() {
    const result = await this.productRepository.find({
      take: 50,
    });
    return result;
  }

  // Get user data by id
  public async getEventData(id: number) {
    return await this.productRepository.findOne({
      where: { id },
      select: this.productRepository as any,
    });
  }

  // Update user data whole
  public async updateEventData(id: number, body: any) {
    return await this.productRepository.update({ id }, body);
  }

  // Delete user by id
  public async deleteEvent(id: number) {
    return await this.productRepository.delete(id);
  }
}
