import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import typeorm from '../config/configuration';

@Module({
  imports: [
    NestConfigModule.forRoot({
      envFilePath: `${process.cwd()}/config/environments/${process.env.NODE_ENV}.env`,
      isGlobal: true,
      load: [typeorm],
    }),
  ],
})
export class ConfigModule {}
