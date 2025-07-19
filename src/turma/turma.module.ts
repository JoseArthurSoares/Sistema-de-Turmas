import { Module } from '@nestjs/common';
import { TurmaService } from './turma.service';
import { TurmaController } from './turma.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Turma} from "./entities/turma.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Turma])],
  controllers: [TurmaController],
  providers: [TurmaService],
})
export class TurmaModule {}
