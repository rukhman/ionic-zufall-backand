import { Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { S3Service } from './s3.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Public } from 'src/guards/auth/decorators';
import { of } from 'rxjs';

@Controller('images')
export class S3Controller {
  constructor(private readonly s3Service: S3Service) {}

  @Public()
  @Post('/')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.s3Service.uploadFile(file);
  }

  @Public()
  @Post('delete')
  remove(@Body() { keys }: { keys: string[] }) {
    if (keys.length) {
      if (keys.length === 1) {
        return this.s3Service.delete(keys[0]);
      } else {
        return this.s3Service.deleteMultipleFiles(keys);
      }
    } else {
      return of();
    }
  }
}
