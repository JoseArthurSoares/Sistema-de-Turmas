import {IsEmail, IsEnum, IsNotEmpty} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export enum TipoUsuario {
    PROFESSOR = 'professor',
    ALUNO = 'aluno',
}

export class CreateUsuarioDto {

    @IsNotEmpty()
    @ApiProperty({ example: 'José', description: 'Nome do usuário' })
    nome!: string;

    @IsEmail()
    @IsNotEmpty()
    @ApiProperty({ example: 'jose@email.com' })
    email!: string;

    @IsNotEmpty()
    @ApiProperty({ example: 'senha123' })
    senha!: string;

    @IsEnum(TipoUsuario)
    tipo_usuario!: TipoUsuario;

}
