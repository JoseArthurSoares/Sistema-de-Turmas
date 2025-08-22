import {IsNotEmpty} from "class-validator";

export class CreatePostagemDto {

    @IsNotEmpty()
    conteudo!: string;

    @IsNotEmpty()
    autorId?: number;

    @IsNotEmpty()
    turmaId?: number;

}
