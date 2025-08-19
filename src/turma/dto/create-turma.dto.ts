import {IsNotEmpty, IsNumber, IsOptional, IsPositive, Length} from "class-validator";
import {Unique} from "typeorm";

export class CreateTurmaDto {

    @IsNotEmpty()
    nome!: string;

    @IsOptional()
    descricao?: string;

    @IsNotEmpty()
    @Length(10, 10)
    codigo_convite!: string;

    @IsNotEmpty()
    @IsNumber()
    @IsPositive()
    professorId!: number;
}
