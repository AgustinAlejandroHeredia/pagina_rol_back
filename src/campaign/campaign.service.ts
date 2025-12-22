import { BadRequestException, Injectable } from '@nestjs/common';

// DTOs
import { CreateCampaignDto } from './dto/create-campaign.dto';

// MONGOOSE
import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose';

// SCHEMAS
import { Campaign, CampaignSchema } from 'src/schemas/Campaign.schema';
import { ReturningStatementNotSupportedError } from 'typeorm'
import { throws } from 'assert';

// SERVICES
import { UserService } from 'src/user/user.service';

@Injectable()
export class CampaignService {

    constructor(
        @InjectModel(Campaign.name) private campaignModel: Model<Campaign>,
        private readonly userService: UserService,
    ){}

    // CREAR CAMPAING
    async createCampaign(userId: string, name: string, description: string, system: string) {

        const dungeonMasterResult = await this.userService.getUserByAuth0Id(userId)
        if(!dungeonMasterResult){
            throw new BadRequestException("Error en autenticacion")
        }

        const dungeonMaster = {
            auth0_id: dungeonMasterResult.auth0_id,
            mongo_id: dungeonMasterResult._id.toString(),
            alias: "Dungeon Master"
        }

        const campaignData : CreateCampaignDto = {
            name: name,
            description: description,
            system: system,
            dungeonMaster,
            users: [dungeonMaster]
        }

        console.log('BODY DE CREATE CAMPAIGN -> ', campaignData)

        // como default el schema inica la lista de usuarios vacia
        const newCampaign = new this.campaignModel(campaignData)
        return newCampaign.save()
    }

    async getCampaignById(campaignId: string){
        return this.campaignModel
            .find({ "_id": campaignId })
            .lean()
            .exec()
    }

    // OBTENER CAMPAÑAS DE UN JUGADOR (busca por auth0_id)
    async getUserCampaings(auth0_id: string) {
        return this.campaignModel
            .find(
                { "users.auth0_id": auth0_id },
                { name: 1, _id: 0 } // solo name
            )
            .lean()
            .exec()
    }

    // OBTENER CAMPAÑAS DE UN JUGADOR (busca por auth0_id) PARA MOSTRAR EN HOME
    async getUserCampaingsHome(auth0_id: string) {
        return this.campaignModel
            .aggregate([
                {
                    // campañas donde esta el usuario
                    $match: {
                        "users.auth0_id": auth0_id
                    },  
                },
                {
                    // "desarmo" el users
                    $unwind: "$users"
                },
                {
                    // traigo el user real
                    $lookup: {
                        from: "users",
                        localField: "users.mongo_id",
                        foreignField: "_id",
                        as: "user",
                    }
                },
                {
                    // trato el user que esta como array
                    $unwind: "$user"
                },
                {
                    // armo la estructura base
                    $project: {
                        _id: "$_id",
                        campaignName: "$name",
                        player: {
                            alias: "$users.alias",
                            realName: "$user.name"
                        }
                    }
                },
                {
                    // agrupo por campaña otra vez
                    $group: {
                        _id: "$_id",
                        campaignName: { $first: "$campaignName" },
                        players: { $push: "$player" }
                    }
                },
                {
                    $project: {
                        _id: 1,
                        campaignName: 1,
                        players: 1
                    }
                }
            ])
    }

}
