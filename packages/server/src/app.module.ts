import { Module } from '@nestjs/common';
import { MorphController } from './morph.controller.js';

@Module({
  imports: [],
  controllers: [MorphController],
  providers: [],
})
export class AppModule {}
