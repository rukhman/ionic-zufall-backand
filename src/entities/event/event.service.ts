import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Event } from './entities/event.entity';
//

@Injectable()
export class EventService {
  constructor(
    @InjectRepository(Event)
    private readonly eventRepository: Repository<Event>,
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
    const newUser = this.eventRepository.create(eventData);
    return await this.eventRepository.save(newUser);
  }

  public async getAllEvents() {
    const result = await this.eventRepository.find({
      take: 50,
    });
    return result;
  }

  public async getMyEvents(id: number) {
    const result = await this.eventRepository.find({
      take: 50,
    });
    return result;
  }

  public async getEventsWithMe(id: number) {
    const result = await this.eventRepository.find({
      take: 50,
    });
    return result;
  }

  // Get user data by id
  public async getEventData(id: number) {
    return await this.eventRepository.findOne({
      where: { id },
      select: this.eventRepository as any,
    });
  }

  // Update user data whole
  public async updateEventData(id: number, body: any) {
    return await this.eventRepository.update({ id }, body);
  }

  // Delete user by id
  public async deleteEvent(id: number) {
    return await this.eventRepository.delete(id);
  }
}
