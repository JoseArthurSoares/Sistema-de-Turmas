import {ConflictException, Injectable, NotFoundException} from '@nestjs/common';
import { CreateTurmaDto } from './dto/create-turma.dto';
import { UpdateTurmaDto } from './dto/update-turma.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {Turma} from "./entities/turma.entity";
import {Repository} from "typeorm";

@Injectable()
export class TurmaService {

  constructor(
      @InjectRepository(Turma)
      private turmaRepository: Repository<Turma>,
  ) {
  }

  async create(createTurmaDto: CreateTurmaDto) {
      const existingNome = await this.turmaRepository.findOne({ where: { nome: createTurmaDto.nome } });
      const existingCodigo = await this.turmaRepository.findOne({ where: { codigo_convite: createTurmaDto.codigo_convite } });
      if (existingNome) {
          throw new ConflictException('Uma turma com este nome já existe.');
      } else if (existingCodigo) {
          throw new ConflictException('Este código de convite já está em uso.');
      }
      return this.turmaRepository.save(createTurmaDto);
  }

  async findAll() {
    return this.turmaRepository.find();
  }

  async findOne(id: number) {
    const turma = await this.turmaRepository.findOne({ where: { id } });
    if(!turma) {
      throw new NotFoundException('Turma não encontrada.');
    }
    return turma;
  }

    async update(id: number, updateTurmaDto: UpdateTurmaDto) {
        const turma = await this.turmaRepository.findOne({ where: { id } });
        if (!turma) {
            throw new NotFoundException('Turma não encontrada.');
        }

        if (updateTurmaDto.nome) {
            const turmaComMesmoNome = await this.turmaRepository.findOne({
                where: { nome: updateTurmaDto.nome },
            });

            if (turmaComMesmoNome && turmaComMesmoNome.id !== id) {
                throw new ConflictException('Uma turma com este nome já existe.');
            }
        }

        return this.turmaRepository.update(id, updateTurmaDto);
    }


  async remove(id: number) {
    const turma = await this.turmaRepository.findOne({ where: { id } });
    if (!turma) {
        throw new NotFoundException('Turma não encontrada.');
    }
    return this.turmaRepository.delete(id);
  }
}
