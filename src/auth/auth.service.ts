import { Injectable } from '@nestjs/common';
import {Usuario} from "../usuario/entities/usuario.entity";
import {JwtService} from "@nestjs/jwt";
import {UsuarioService} from "../usuario/usuario.service";
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {

  constructor(
      private readonly jwtService: JwtService,
      private usuarioService: UsuarioService,
  ) {}

  async validateUser(email: string, pass: string): Promise<Omit<Usuario, "senha"> | null> {
    const user = await this.usuarioService.findOne(email);
    console.log(user);
    if (user && await bcrypt.compare(pass, user.senha)) {
      const { senha, ...result } = user;
      return result;
    }
    return null;
  }


  async login(user: Usuario): Promise<{ access_token: string }> {
    const payload = {
      email: user.email ,
      sub: user.id,
      nome: user.nome,
      tipo_usuario: user.tipo_usuario,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}

