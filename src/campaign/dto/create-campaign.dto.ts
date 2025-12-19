import { IsArray, IsMongoId, IsNotEmpty, IsOptional, IsString } from "class-validator"
import { ObjectId } from "typeorm"

// MONGOOSE
import mongoose from "mongoose";
import { Prop } from "@nestjs/mongoose";

// UserSchema
import { User } from "src/schemas/User.schema";

// MapElemSchema
import { MapElemSchema } from "src/schemas/MapElem.schema";

export class CreateCampaignDto {

    @IsString()
    @IsNotEmpty()
    name: string

    // lista de IDs de usuarios
    @IsOptional()
    @IsArray()
    @IsMongoId({ each: true })
    users?: string[]

    // lista de IDs de elementos de mapa
    @IsOptional()
    @IsArray()
    @IsMongoId({ each: true })
    mapElems?: string[]

}