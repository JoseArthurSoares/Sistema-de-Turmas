import { PartialType } from '@nestjs/mapped-types';
import { CreateUsuarioDto } from './create-usuario.dto';
import {IsEmail, IsNotEmpty} from "class-validator";

export class UpdateUsuarioDto extends PartialType(CreateUsuarioDto) {
    @IsNotEmpty()
    nome!: string;

    @IsEmail()
    @IsNotEmpty()
    email!: string;
}
