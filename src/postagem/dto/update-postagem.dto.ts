import { PartialType } from '@nestjs/mapped-types';
import { CreatePostagemDto } from './create-postagem.dto';
import {IsNotEmpty} from "class-validator";

export class UpdatePostagemDto extends PartialType(CreatePostagemDto) {

    @IsNotEmpty()
    conteudo!: string;
}
