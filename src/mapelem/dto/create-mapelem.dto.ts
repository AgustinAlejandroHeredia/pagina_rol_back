import { IsBoolean, IsNotEmpty, IsNumber, IsString } from "class-validator"

export class CreateMapElemDto {

    @IsString()
    @IsNotEmpty()
    title:string

    @IsNumber()
    @IsNotEmpty()
    capa:number

    @IsBoolean()
    @IsNotEmpty()
    visible:boolean

    @IsString()
    @IsNotEmpty()
    type:string

    @IsString()
    @IsNotEmpty()
    coords:string

}