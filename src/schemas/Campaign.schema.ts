import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import mongoose, { Document } from "mongoose"

// Usuarios
import { User } from "./User.schema";

// MapElems
import { MapElem } from "./MapElem.schema";

@Schema()
export class Campaign extends Document {

    @Prop({required:true})
    name:string;

    // lista de IDs de usuarios
    @Prop({
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
        required: false,
        default: []
    })
    users: User[];

    // lista de IDs de elementos de mapa (mapelems)
    @Prop({
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MapElem' }],
        required: false,
        default: []
    })
    mapElems: MapElem[];

}

export const CampaignSchema = SchemaFactory.createForClass(Campaign)