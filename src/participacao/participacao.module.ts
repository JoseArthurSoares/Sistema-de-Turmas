import { Module } from '@nestjs/common';
import { ParticipacaoService } from './participacao.service';
import { ParticipacaoController } from './participacao.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Participacao} from "./entities/participacao.entity";
import {Turma} from "../turma/entities/turma.entity";
import {Usuario} from "../usuario/entities/usuario.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Participacao, Turma, Usuario])],
  controllers: [ParticipacaoController],
  providers: [ParticipacaoService],
})
export class ParticipacaoModule {}
