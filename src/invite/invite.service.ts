import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';

// MONGOOSE
import { InjectModel } from '@nestjs/mongoose';

// SCHEMAS
import { Model } from 'mongoose';
import { Invite } from 'src/schemas/Invite.schema';

// SERVICES
import { CampaignService } from 'src/campaign/campaign.service';
import { UserService } from 'src/user/user.service';

// CRYPTO
import { randomBytes } from 'crypto';
import { InviteDto } from './dto/invite.dto';

@Injectable()
export class InviteService {

    constructor(
        @InjectModel(Invite.name) private inviteModel: Model<Invite>,
        private readonly userService: UserService,
        private readonly campaignService: CampaignService,
    ){}

    private generateCode(length = 6): string {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        const bytes = randomBytes(length);
        return Array.from(bytes, b => chars[b % chars.length]).join('');
    } 

    async createInvite(userId: string, campaign_id: string, email: string) {

        // existe la campaña que se busca
        const campaign = await this.campaignService.getCampaignById(campaign_id)
        if(!campaign){
            throw new BadRequestException("Campaign not found")
        }
        console.log("campaign obtained")

        // verifica que exista el usuario
        const finalUser = await this.userService.userEmailExists(email) || null
        if(!finalUser){
            throw new BadRequestException("Error al enviar el email")
        }
        console.log("finalUser obtained")

        // verifica que el emisario existe
        const senderUser = await this.userService.getUserByAuth0Id(userId)
        if(!senderUser){
            throw new BadRequestException();
        }
        console.log("senderUser obtained")

        const for_mongo_id = finalUser._id.toString()

        const from_mongo_id = senderUser._id.toString()

        const expires_at = new Date(Date.now() + 12 * 60 * 60 * 1000)

        const token = this.generateCode()

        const inviteData : InviteDto = {
            campaign_id: campaign_id,
            from_mongo_id: from_mongo_id,
            for_mongo_id: for_mongo_id,
            expires_at: expires_at,
            token: token
        }

        const newIvite = new this.inviteModel(inviteData)
        const savedData = await newIvite.save()

        console.log(savedData)
    }

}
