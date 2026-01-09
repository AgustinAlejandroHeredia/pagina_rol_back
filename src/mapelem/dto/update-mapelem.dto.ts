import { IsBoolean, IsMongoId, IsNumber, IsOptional, IsString } from "class-validator"

export class UpdateMapElemDto {

    @IsString()
    @IsOptional()
    name?:string

    @IsString()
    @IsOptional()
    description?:string

    @IsString()
    @IsOptional()
    type?:string

    @IsBoolean()
    @IsOptional()
    visible?:boolean

    @IsNumber()
    @IsOptional()
    layer?:number

    @IsString()
    @IsOptional()
    coords?:string

    @IsString()
    @IsOptional()
    picture?:string

    @IsMongoId()
    @IsOptional()
    campaignId?: string;

    @IsNumber()
    @IsOptional()
    x?: number

    @IsNumber()
    @IsOptional()
    y?: number

}