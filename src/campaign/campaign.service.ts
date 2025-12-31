import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';

// DTOs
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';

// MONGOOSE
import { Model, Types } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose';

// SCHEMAS
import { Campaign, CampaignSchema } from 'src/schemas/Campaign.schema';
import { ReturningStatementNotSupportedError } from 'typeorm'
import { throws } from 'assert';

// SERVICES
import { UserService } from 'src/user/user.service';

// BACKBLAZE
import { BackblazeService } from 'src/backblaze/backblaze.service';

@Injectable()
export class CampaignService {

    constructor(
        @InjectModel(Campaign.name) private campaignModel: Model<Campaign>,
        private readonly backblazeService: BackblazeService,
        private readonly userService: UserService,
    ){}

    // CREAR CAMPAING
    async createCampaign(userId: string, name: string, description: string, system: string) {

        try {

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

            // POR ULTIMO MANDA A CREAR LA CARPETA DE LA CAMPAÑA EN BACKBLAZE
            this.backblazeService.initializeCampaignStorage(newCampaign._id.toString())

            return newCampaign.save()

        } catch (error) {
            throw new InternalServerErrorException('Error creating the campaign')
        }
    }

    async updateCampaign(campaignId: string, updateData: UpdateCampaignDto){
        return this.campaignModel.findByIdAndUpdate(
            campaignId,
            {$set: updateData},
            {new: true},
        ).lean()
    }

    async deleteCampaign(campaignId: string){
        return this.campaignModel.findByIdAndDelete(campaignId).lean()
    }

    async getCampaignById(campaignId: string){
        return this.campaignModel
            .findById({ "_id": campaignId })
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

    async getUsersCampaign(campaign_id: string) {
        return this.campaignModel
            .aggregate([
                {
                    // filtro por esta campaña
                    $match: {
                        _id: new Types.ObjectId(campaign_id),
                    },
                },
                {
                    // separo cada user del array que me devuelve
                    $unwind: '$users',
                },
                {
                    // lookup para buscar en la coleccion de usuarios
                    $lookup: {
                        from: 'users', // nombre REAL de la colección
                        localField: 'users.mongo_id',
                        foreignField: '_id',
                        as: 'userData',
                    },
                },
                {
                    // separo el array userData
                    $unwind: '$userData',
                },
                {
                    // proyeccion final
                    $project: {
                        _id: 0,
                        name: '$userData.name',
                        alias: '$users.alias',
                    },
                },
            ])
    }

    async isDungeonMaster(campaign_id: string, auth0_id: string): Promise<boolean> {
        const campaign = await this.campaignModel
            .findOne(
                {
                    _id: campaign_id,
                    'dungeonMaster.auth0_id': auth0_id,
                },
                { _id: 1 },
            )
        return !!campaign
    }

}
