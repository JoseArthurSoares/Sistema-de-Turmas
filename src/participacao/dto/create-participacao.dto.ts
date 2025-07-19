import {IsNotEmpty, IsNumber, IsPositive} from "class-validator";

export class CreateParticipacaoDto {

    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    usuarioId!: number;

    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    turmaId!: number;
}
