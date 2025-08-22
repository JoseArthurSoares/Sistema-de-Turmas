import { Module } from '@nestjs/common';
import { PostagemService } from './postagem.service';
import { PostagemController } from './postagem.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Turma} from "../turma/entities/turma.entity";
import {Usuario} from "../usuario/entities/usuario.entity";
import {Postagem} from "./entities/postagem.entity";

@Module({
    imports: [TypeOrmModule.forFeature([Postagem, Turma, Usuario])],
  controllers: [PostagemController],
  providers: [PostagemService],
})
export class PostagemModule {}
