import { Injectable } from '@nestjs/common';
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
    return this.turmaRepository.save(createTurmaDto);
  }

  async findAll() {
    return this.turmaRepository.find();
  }

  async findOne(id: number) {
    return this.turmaRepository.findOne({ where: { id } });
  }

  async update(id: number, updateTurmaDto: UpdateTurmaDto) {
    return this.turmaRepository.update(id, updateTurmaDto);
  }

  remove(id: number) {
    return this.turmaRepository.delete(id);
  }
}
