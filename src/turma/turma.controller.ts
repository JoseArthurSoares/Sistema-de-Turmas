import {Controller, Get, Post, Body, Patch, Param, Delete, Put, UseGuards} from '@nestjs/common';
import { TurmaService } from './turma.service';
import { CreateTurmaDto } from './dto/create-turma.dto';
import { UpdateTurmaDto } from './dto/update-turma.dto';
import {ApiOperation} from "@nestjs/swagger";
import {Roles} from "../auth/guards/roles.decorator";

@Controller('turma')
export class TurmaController {
  constructor(private readonly turmaService: TurmaService) {}

  @Post()
  @Roles('Professor')
  async create(@Body() createTurmaDto: CreateTurmaDto) {
    return await this.turmaService.create(createTurmaDto);
  }

  @Get()
  findAll() {
    return this.turmaService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Recupera turma pelo ID' })
  findOne(@Param('id') id: string) {
    return this.turmaService.findOne(+id);
  }

  @Put(':id')
  @Roles('Professor')
  update(@Param('id') id: string, @Body() updateTurmaDto: UpdateTurmaDto) {
    return this.turmaService.update(+id, updateTurmaDto);
  }

  @Delete(':id')
  @Roles('Professor')
  remove(@Param('id') id: string) {
    return this.turmaService.remove(+id);
  }
}
