import { Module } from '@nestjs/common';
import { BackblazeService } from './backblaze.service';
import { BackblazeController } from './backblaze.controller';

@Module({
  providers: [BackblazeService],
  controllers: [BackblazeController],
  exports: [BackblazeService],
})
export class BackblazeModule {}
