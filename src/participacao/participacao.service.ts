import { Injectable } from '@nestjs/common';
import { CreateParticipacaoDto } from './dto/create-participacao.dto';
import { UpdateParticipacaoDto } from './dto/update-participacao.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {Participacao} from "./entities/participacao.entity";
import {DeepPartial, Repository} from "typeorm";
import {Turma} from "../turma/entities/turma.entity";
import {Usuario} from "../usuario/entities/usuario.entity";

@Injectable()
export class ParticipacaoService {

  constructor(
      @InjectRepository(Participacao)
      private participacaoRepository: Repository<Participacao>,

      @InjectRepository(Turma)
      private turmaRepository: Repository<Turma>,

      @InjectRepository(Usuario)
      private usuarioRepository: Repository<Usuario>,
  ) {
  }

  async create(createParticipacaoDto: CreateParticipacaoDto) {
    const usuario = await this.usuarioRepository.findOne({
      where:{ id: createParticipacaoDto.usuarioId}
    });
    const turma = await this.turmaRepository.findOne({
      where:{ id: createParticipacaoDto.turmaId}
    })

    const participacao = this.participacaoRepository.create({
      usuario,
      turma
    }  as DeepPartial<Participacao>);

    return this.participacaoRepository.save(participacao);
  }

  async findAll() {
    return this.participacaoRepository.find();
  }

  async findOne(id: number) {
    return this.participacaoRepository.findOne({where: {id: id}});
  }

  update(id: number, updateParticipacaoDto: UpdateParticipacaoDto) {
    return `This action updates a #${id} participacao`;
  }

  async remove(id: number) {
    return this.participacaoRepository.delete(id);
  }
}
