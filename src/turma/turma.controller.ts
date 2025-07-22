import {Controller, Get, Post, Body, Patch, Param, Delete, Put} from '@nestjs/common';
import { TurmaService } from './turma.service';
import { CreateTurmaDto } from './dto/create-turma.dto';
import { UpdateTurmaDto } from './dto/update-turma.dto';
import {ApiOperation} from "@nestjs/swagger";

@Controller('turma')
export class TurmaController {
  constructor(private readonly turmaService: TurmaService) {}

  @Post()
  @ApiOperation({ summary: 'Cria uma nova turma' })
  async create(@Body() createTurmaDto: CreateTurmaDto) {
    return await this.turmaService.create(createTurmaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Recupera todas as turmas' })
  findAll() {
    return this.turmaService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Recupera turma pelo ID' })
  findOne(@Param('id') id: string) {
    return this.turmaService.findOne(+id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualiza turma' })
  update(@Param('id') id: string, @Body() updateTurmaDto: UpdateTurmaDto) {
    return this.turmaService.update(+id, updateTurmaDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deleta turma' })
  remove(@Param('id') id: string) {
    return this.turmaService.remove(+id);
  }
}
