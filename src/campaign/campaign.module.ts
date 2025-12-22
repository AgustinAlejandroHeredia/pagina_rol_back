import { Module } from '@nestjs/common';
import { CampaignController } from './campaign.controller';
import { CampaignService } from './campaign.service';
import { UserModule } from 'src/user/user.module';

// MONGOOSE
import { MongooseModule } from '@nestjs/mongoose';

// SCHEMAS
import { Campaign, CampaignSchema } from 'src/schemas/Campaign.schema';

@Module({

  imports: [
    MongooseModule.forFeature([{
      name: Campaign.name,
      schema: CampaignSchema,
    }]),
    UserModule
  ],

  controllers: [CampaignController],
  providers: [CampaignService],
  exports: [CampaignService],

})

export class CampaignModule {}
