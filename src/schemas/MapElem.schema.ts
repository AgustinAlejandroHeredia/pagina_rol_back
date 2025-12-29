import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document, Types } from "mongoose"
import { Campaign } from "./Campaign.schema";

@Schema()
export class MapElem extends Document {

    @Prop({required:true})
    name:string;

    @Prop({required:true})
    description:string

    @Prop({required:true})
    type:string

    @Prop({required:true})
    visible:boolean

    @Prop({required:true})
    layer:number

    @Prop({required:false})
    coords:string

    @Prop({required:false})
    picture:string

    @Prop({
        type: Types.ObjectId,
        ref: Campaign.name,
        required: true,
    })
    campaignId: Types.ObjectId;

}

export const MapElemSchema = SchemaFactory.createForClass(MapElem)