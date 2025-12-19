import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document } from "mongoose"

@Schema()
export class MapElem extends Document {

    @Prop({required:true})
    title:string;

    @Prop({required:true})
    capa:number

    @Prop({required:true})
    visible:boolean

    @Prop({required:true})
    type:string

    @Prop({required:true})
    coords:string

}

export const MapElemSchema = SchemaFactory.createForClass(MapElem)