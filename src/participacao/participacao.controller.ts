import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { ParticipacaoService } from './participacao.service';
import { CreateParticipacaoDto } from './dto/create-participacao.dto';
import {ApiOperation} from "@nestjs/swagger";

@Controller('participacao')
export class ParticipacaoController {
  constructor(private readonly participacaoService: ParticipacaoService) {}

  @Post()
  @ApiOperation({ summary: 'Cria uma nova participacao(Aluno e turma)' })
  async create(@Body() createParticipacaoDto: CreateParticipacaoDto) {
    return await this.participacaoService.create(createParticipacaoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Recupera todas as participações' })
  async findAll() {
    return await this.participacaoService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Recupera participação pelo id' })
  findOne(@Param('id') id: string) {
    return this.participacaoService.findOne(+id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deleta participação' })
  remove(@Param('id') id: string) {
    return this.participacaoService.remove(+id);
  }
}
