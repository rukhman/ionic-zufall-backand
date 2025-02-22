import { Controller, Get, Post, Req, Res, Param, ParseIntPipe } from '@nestjs/common';
import { Response, Request } from 'express';

import { ApiTags } from '@nestjs/swagger';
import { ProductService } from './product.service';

@ApiTags('products')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('/')
  async findAll(@Res() res: Response) {
    const events = await this.productService.getAllEvents();
    return res.send({
      status: 'ok',
      data: events,
    });
  }

  @Get('/:id')
  async getUser(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    const userData = await this.productService.getEventData(id);

    return res.send({
      status: 'ok',
      data: userData,
    });
  }

  @Post('/')
  async createUser(@Req() req: Request, @Res() res: Response) {
    await this.productService.createEvent(req.body);
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
