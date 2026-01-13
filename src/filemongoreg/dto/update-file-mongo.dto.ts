import { IsBoolean, IsOptional } from "class-validator";

export class UpdateFileMongoDto {

    @IsBoolean()
    @IsOptional()
    visibility?: boolean;

}