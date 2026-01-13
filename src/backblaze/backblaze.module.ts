import { forwardRef, Module } from '@nestjs/common';
import { BackblazeService } from './backblaze.service';
import { BackblazeController } from './backblaze.controller';
import { CampaignModule } from 'src/campaign/campaign.module';
import { FileMongoRegModule } from 'src/filemongoreg/filemongoreg.module';

@Module({
  imports: [
    forwardRef(() => CampaignModule),
    FileMongoRegModule,
  ],
  providers: [BackblazeService],
  controllers: [BackblazeController],
  exports: [BackblazeService],
})
export class BackblazeModule {}
