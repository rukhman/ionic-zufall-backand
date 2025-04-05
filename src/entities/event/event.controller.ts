import { Controller, Get, Post, Req, Res, Param, ParseIntPipe, UseInterceptors } from '@nestjs/common';
import { Response, Request } from 'express';

import { EventService } from './event.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/guards/auth/decorators';
import { AppendUserInfoInterceptor } from 'src/interceptors/append-user-info/append-user-info.interceptor';

@ApiTags('events')
@ApiBearerAuth()
@Controller('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Public()
  @Get('/')
  async findAll() {
    const events = await this.eventService.getAllEvents();
    return events;
  }

  @Public()
  @Get('/my')
  @UseInterceptors(AppendUserInfoInterceptor)
  async findMy() {
    const events = await this.eventService.getMyEvents();
    return events;
  }

  @Public()
  @Get('/withMe')
  @UseInterceptors(AppendUserInfoInterceptor)
  async withMe() {
    const events = await this.eventService.getEventsWithMe();
    return events;
  }

  @Public()
  @Get('/:id')
  async getEventById(@Param('id', ParseIntPipe) id: number) {
    const event = await this.eventService.getEventData(id);
    return event;
  }

  @Post('/')
  async createUser(@Req() req: Request, @Res() res: Response) {
    await this.eventService.createEvent(req.body);
    return res.send({ status: 'ok' });
  }

  // @Put('/:id')
  // async updateUser(
  //   @Param('id', ParseIntPipe) id: number,
  //   @Body() body: UpdateUserDto,
  //   @Res() res: Response,
  // ) {
  //   this.userService.updateUserData(id, body);
  //   return res.send({ status: 'ok' });
  // }

  // @Delete('/:id')
  // async deleteUser(
  //   @Param('id', ParseIntPipe) id: number,
  //   @Res() res: Response,
  // ) {
  //   this.userService.deleteUser(id);
  //   return res.send({ status: 'ok' });
  // }
}
