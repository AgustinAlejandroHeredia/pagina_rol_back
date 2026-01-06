import { forwardRef, Module } from '@nestjs/common';
import { BackblazeService } from './backblaze.service';
import { BackblazeController } from './backblaze.controller';
import { CampaignModule } from 'src/campaign/campaign.module';

@Module({
  imports: [
    forwardRef(() => CampaignModule),
  ],
  providers: [BackblazeService],
  controllers: [BackblazeController],
  exports: [BackblazeService],
})
export class BackblazeModule {}
