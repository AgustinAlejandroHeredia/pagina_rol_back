import { BadRequestException, ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';

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

    private isExpired(expires_at: string): boolean{
        const now = new Date()
        const expiresAt = new Date(expires_at)
        if(expiresAt < now){
            return true
        }
        return false
    }

    // TESTED
    async createInvite(auth0_sender_userId: string, campaign_id: string, email: string) {

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
        const finalUserId = finalUser._id.toString()

        // verifica que no exista una invitacion a este usuario para esta campaña
        const now = new Date().toString();
        const existingInvite = await this.inviteModel.findOne({
            for_mongo_id: finalUserId,
            campaign_id,
        }).lean();

        if(existingInvite){
            console.log("YA EXISTE UNA INVITACION")
            throw new ConflictException('Invitation alredy exists')
        }
        console.log("no existe invitacion para userId : ", finalUserId, " y campaignId : ", campaign_id)

        // verifica que el emisario existe
        const senderUser = await this.userService.getUserByAuth0Id(auth0_sender_userId)
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

    async getInviteByToken(token: string) {
        return this.inviteModel
            .findOne(
                { "token": token }
            )
            .lean()
            .exec()
    }

    async deleteInvite(inviteId: string) {
        return this.inviteModel.findByIdAndDelete(inviteId).lean()
    }

    async validateInvite(token: string, alias: string) {

        const invite = await this.getInviteByToken(token);

        if (!invite) {
            throw new BadRequestException('Invitación inválida');
        }

        if (this.isExpired(invite.expires_at)) {
            await this.deleteInvite(invite._id.toString());
            throw new BadRequestException('Invitación expirada');
        }

        if (!invite.campaign_id || !invite.for_mongo_id) {
            throw new InternalServerErrorException('Invitación corrupta');
        }

        try {

            await this.campaignService.addUser(
                invite.campaign_id,
                invite.for_mongo_id,
                alias,
            );

            await this.deleteInvite(invite._id.toString());
        } catch (error) {
            throw new InternalServerErrorException(
                'Error al procesar la invitación',
            );
        }

        return { success: true };
    }

}
