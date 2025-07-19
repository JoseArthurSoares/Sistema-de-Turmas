import {IsEmail, IsEnum, IsNotEmpty} from "class-validator";

export enum TipoUsuario {
    PROFESSOR = 'professor',
    ALUNO = 'aluno',
}

export class CreateUsuarioDto {

    @IsNotEmpty()
    nome!: string;

    @IsEmail()
    @IsNotEmpty()
    email!: string;

    @IsNotEmpty()
    senha!: string;

    @IsEnum(TipoUsuario)
    tipo_usuario!: TipoUsuario;

}
