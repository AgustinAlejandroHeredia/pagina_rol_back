import { IsArray, IsMongoId, IsNotEmpty, IsOptional, IsString, ValidateNested } from "class-validator"
import { ObjectId } from "typeorm"

// MONGOOSE
import mongoose from "mongoose";
import { Prop } from "@nestjs/mongoose";

// UserSchema
import { User } from "src/schemas/User.schema";

// MapElemSchema
import { MapElemSchema } from "src/schemas/MapElem.schema";

// CampaignUserDto
import { CampaignUserDto } from "./campaign-user.dto";

export class CreateCampaignDto {

    @IsString()
    @IsNotEmpty()
    name: string

    // lista de IDs de usuarios ( id_mongo, id_auth0 )
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    users?: CampaignUserDto[];

    // lista de IDs de elementos de mapa
    @IsOptional()
    @IsArray()
    @IsMongoId({ each: true })
    mapElems?: string[]

}