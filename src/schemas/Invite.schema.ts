import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import mongoose, { Document } from "mongoose"

@Schema()
export class Invite extends Document {

    @Prop({required:true})
    campaign_id: string

    @Prop({required:true})
    from_mongo_id: string

    @Prop({required:true})
    for_mongo_id: string

    @Prop({required:true})
    expires_at: string

    @Prop({required:true})
    token: string

}

export const InviteSchema = SchemaFactory.createForClass(Invite)