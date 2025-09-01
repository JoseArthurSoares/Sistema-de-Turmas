import {ConflictException, Injectable, NotFoundException} from '@nestjs/common';
import { CreateParticipacaoDto } from './dto/create-participacao.dto';
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
    });

    if (!usuario) {
        throw new NotFoundException('Usuário não foi encontrado');
    }

    if (!turma) {
        throw new NotFoundException('Turma não foi encontrada');
    }

    if (usuario.tipo_usuario === 'PROFESSOR') {
        const professorExistente = await this.participacaoRepository.findOne({
            where: {
                turma: { id: turma.id },
                usuario: { tipo_usuario: 'PROFESSOR' },
            },
        });
        if (professorExistente) {
            throw new ConflictException('Só é possível cadastrar um professor por turma.');
        }
    }

    const participacao = this.participacaoRepository.create({
      usuario,
      turma
    }  as DeepPartial<Participacao>);

    return this.participacaoRepository.save(participacao);
  }

  async findAll() {
    return this.participacaoRepository.find({
        relations: ['usuario', 'turma']
    });
  }

  async findOne(id: number) {
      const participacao = await this.participacaoRepository.findOne({
          where: {id: id},
          relations: ['usuario', 'turma']
      });
      if (!participacao) {
          throw new NotFoundException(`Participação não foi encontrada`);
      }
      return participacao;
  }

  async remove(id: number) {
      const participacao = await this.participacaoRepository.findOne({
          where: {id: id},
          relations: ['usuario', 'turma']
      });
      if (!participacao) {
            throw new NotFoundException(`Participação não foi encontrada`);
        }
      return this.participacaoRepository.delete(id);
  }

    async findAllTurmasByUsuario(id: number) {
      const usuario = this.usuarioRepository.findOne({ where: { id: id } });
      if (!usuario) {
          throw new NotFoundException('Usuário não foi encontrado');
      }
      const participacoes = await this.participacaoRepository.find({
          where: { usuario: { id: id } },
          relations: ['turma'],
      });

      return participacoes.map(p => ({
          turma: p.turma,
      }));
  }
}
