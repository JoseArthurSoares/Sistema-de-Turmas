import { PartialType } from '@nestjs/mapped-types';
import { CreateTurmaDto } from './create-turma.dto';
import {IsNotEmpty, IsOptional} from "class-validator";

export class UpdateTurmaDto extends PartialType(CreateTurmaDto) {
    @IsNotEmpty()
    nome!: string;

    @IsOptional()
    descricao?: string;
}
