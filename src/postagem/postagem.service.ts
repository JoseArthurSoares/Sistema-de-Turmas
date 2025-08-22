import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import { CreatePostagemDto } from './dto/create-postagem.dto';
import { UpdatePostagemDto } from './dto/update-postagem.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {Postagem} from "./entities/postagem.entity";
import {Repository} from "typeorm";
import {Usuario} from "../usuario/entities/usuario.entity";
import {Turma} from "../turma/entities/turma.entity";

@Injectable()
export class PostagemService {

    constructor(
        @InjectRepository(Postagem)
        private postagemRepository: Repository<Postagem>,

        @InjectRepository(Usuario)
        private usuarioRepository: Repository<Usuario>,

        @InjectRepository(Turma)
        private turmaRepository: Repository<Turma>,
    ) {
    }

  async create(createPostagemDto: CreatePostagemDto) {
        const usuario = await this.usuarioRepository.findOne({
            where: { id: createPostagemDto.autorId }
        });
        if (!usuario) {
            throw new NotFoundException('Usuário não encontrado');
        }
        const turma = await this.turmaRepository.findOne({
            where: { id: createPostagemDto.turmaId }
        });
        if (!turma) {
            throw new NotFoundException('Turma não encontrada');
        }

        return this.postagemRepository.save(
            {
                conteudo: createPostagemDto.conteudo,
                autor: usuario,
                turma: turma
            }
        );
  }

  findAll() {
    return this.postagemRepository.find();
  }

  findOne(id: number) {
    const postagem = this.postagemRepository.findOne({
        where: {id: id},
    });
    if (!postagem) {
        throw new BadRequestException('Postagem não encontrada');
    }
    return postagem;
  }

  update(id: number, updatePostagemDto: UpdatePostagemDto) {
    const postagem = this.postagemRepository.findOne({
        where: {id: id},
    });
    if (!postagem) {
        throw new BadRequestException('Postagem não encontrada');
    }

    return this.postagemRepository.update(id, updatePostagemDto);
  }

  remove(id: number) {
    const postagem = this.postagemRepository.findOne({
        where: {id: id},
    });
    if (!postagem) {
        throw new BadRequestException('Postagem não encontrada');
    }
    return this.postagemRepository.delete(id);
  }
}
