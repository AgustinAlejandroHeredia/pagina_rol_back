import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document } from "mongoose"

@Schema()
export class FileMongo extends Document {

    @Prop({required:true, unique: true})
    file_id: string;

    @Prop({required:true, default:false})
    visibility: boolean;

}

export const FileMongoSchema = SchemaFactory.createForClass(FileMongo)