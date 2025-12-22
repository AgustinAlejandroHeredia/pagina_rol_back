import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import mongoose, { Document } from "mongoose"

@Schema()
export class CampaignUser extends Document {

    // USADO PARA DEFINIR EL DATO DENTRO DE CAMPAING.USERS[]

    // ID APLICADA POR MONGO
    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        required: true
    })
    mongo_id: mongoose.Types.ObjectId 

    // ID DE AUTH0
    @Prop({required: true})
    auth0_id: string

    // Alias de su personaje
    @Prop({required: true})
    alias: string

}