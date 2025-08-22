import {Injectable, NotFoundException} from '@nestjs/common';
import {CreateUsuarioDto} from './dto/create-usuario.dto';
import {UpdateUsuarioDto} from './dto/update-usuario.dto';
import {Usuario} from "./entities/usuario.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import * as bcrypt from 'bcrypt';


@Injectable()
export class UsuarioService {

  constructor(
      @InjectRepository(Usuario)
      private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  async create(createUsuarioDto: CreateUsuarioDto) {
    createUsuarioDto.senha = await bcrypt.hash(createUsuarioDto.senha, 10);
    return this.usuarioRepository.save(createUsuarioDto);
  }

  async findAll() {
    return this.usuarioRepository.find();
  }

  async findOneByEmail(email: string) {
    const usuario = await this.usuarioRepository.findOne({ where: { email } });
    if (!usuario) {
      throw new NotFoundException(`Usuário não encontrado`);
    }
    return usuario;
  }

  async findOneById(id: number) {
    const usuario = await this.usuarioRepository.findOne({where: {id}});
    if (!usuario) {
      throw new NotFoundException(`Usuário não encontrado`);
    }
    return usuario;
  }

  async update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    const usuario = await this.usuarioRepository.findOne({where: {id}});
    if (!usuario) {
        throw new NotFoundException(`Usuário não encontrado`);
    }
    return this.usuarioRepository.update(id, updateUsuarioDto);
  }

  async remove(id: number) {
    return this.usuarioRepository.delete(id);
  }
}
