import { IsBoolean, IsMongoId, IsNotEmpty, IsString } from "class-validator";

export class FileMongoDto {

    @IsString()
    @IsNotEmpty()
    file_id: string;

    @IsBoolean()
    @IsNotEmpty()
    visibility: boolean;

}