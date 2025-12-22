import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import mongoose, { Document } from "mongoose"

// Campaing.Usuarios
import { CampaignUser } from "./CampaingUser.schema";

// MapElems
import { MapElem } from "./MapElem.schema";

@Schema()
export class Campaign extends Document {

    @Prop({required:true})
    name:string;

    @Prop({required:true})
    description:string

    @Prop({required:true})
    dungeonMaster: CampaignUser

    @Prop({required:true})
    system: string

    // lista de usuarios dentro de campaing (tiene id_mongo id_auth0)
    @Prop({
        type: [CampaignUser],
        default: []
    })
    users: CampaignUser[];

    // lista de IDs de elementos de mapa (mapelems)
    @Prop({
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MapElem' }],
        required: false,
        default: []
    })
    mapElems: MapElem[];

}

export const CampaignSchema = SchemaFactory.createForClass(Campaign)