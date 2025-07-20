import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { ParticipacaoService } from './participacao.service';
import { CreateParticipacaoDto } from './dto/create-participacao.dto';

@Controller('participacao')
export class ParticipacaoController {
  constructor(private readonly participacaoService: ParticipacaoService) {}

  @Post()
  async create(@Body() createParticipacaoDto: CreateParticipacaoDto) {
    return await this.participacaoService.create(createParticipacaoDto);
  }

  @Get()
  async findAll() {
    return await this.participacaoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.participacaoService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.participacaoService.remove(+id);
  }
}
