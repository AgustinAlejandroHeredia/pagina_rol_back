import { Module } from '@nestjs/common';
import { InviteController } from './invite.controller';
import { InviteService } from './invite.service';
import { UserService } from 'src/user/user.service';
import { CampaignService } from 'src/campaign/campaign.service';

// MONGOOSE
import { MongooseModule } from '@nestjs/mongoose';

// SCHEMAS
import { Invite, InviteSchema} from 'src/schemas/Invite.schema';

// MODULES
import { CampaignModule } from 'src/campaign/campaign.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([{
      name: Invite.name,
      schema: InviteSchema,
    }]),
    UserModule,
    CampaignModule,
  ],
  controllers: [InviteController],
  providers: [InviteService],
  exports: [InviteService]
})
export class InviteModule {}
