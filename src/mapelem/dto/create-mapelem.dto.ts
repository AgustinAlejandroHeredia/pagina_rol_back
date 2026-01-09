import { IsBoolean, IsMongoId, IsNotEmpty, IsNumber, IsString } from "class-validator"

export class CreateMapElemDto {

    @IsString()
    @IsNotEmpty()
    name:string

    @IsString()
    @IsNotEmpty()
    description:string

    @IsString()
    @IsNotEmpty()
    type:string

    @IsBoolean()
    @IsNotEmpty()
    visible:boolean

    @IsNumber()
    @IsNotEmpty()
    layer:number

    @IsString()
    coords:string

    @IsString()
    picture:string

    @IsMongoId()
    campaignId: string;

    @IsNumber()
    @IsNotEmpty()
    x: number

    @IsNumber()
    @IsNotEmpty()
    y: number

}