import { Injectable } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import {Usuario} from "./entities/usuario.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {where} from "sequelize";

@Injectable()
export class UsuarioService {

  constructor(
      @InjectRepository(Usuario)
      private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  async create(createUsuarioDto: CreateUsuarioDto) {
    return this.usuarioRepository.save(createUsuarioDto);
  }

  async findAll() {
    return this.usuarioRepository.find();
  }

  async findOne(id: number) {
    return this.usuarioRepository.findOne({ where: { id } });
  }

  async update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    return this.usuarioRepository.update(id, updateUsuarioDto);
  }

  async remove(id: number) {
    return this.usuarioRepository.delete(id);
  }
}
