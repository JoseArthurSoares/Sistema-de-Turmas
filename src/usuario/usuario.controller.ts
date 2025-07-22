import {Controller, Get, Post, Body, Patch, Param, Delete, Put} from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import {ApiOperation} from "@nestjs/swagger";

@Controller('usuario')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Post()
  @ApiOperation({ summary: 'Cria um novo usuário' })
  async create(@Body() createUsuarioDto: CreateUsuarioDto) {
    return await this.usuarioService.create(createUsuarioDto);
  }

  @Get()
  @ApiOperation({ summary: 'Recupera todos usuários' })
  async findAll() {
    return await this.usuarioService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Recupera usuário pelo id' })
  async findOne(@Param('id') id: number) {
    return await this.usuarioService.findOne(+id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualiza usuário' })
  async update(@Param('id') id: number, @Body() updateUsuarioDto: UpdateUsuarioDto) {
    return await this.usuarioService.update(+id, updateUsuarioDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deleta usuário' })
  async remove(@Param('id') id: number) {
    return await this.usuarioService.remove(+id);
  }
}
