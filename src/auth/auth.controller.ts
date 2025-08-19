import {Controller, Post, Req, UseGuards} from '@nestjs/common';
import { AuthService } from './auth.service';
import {AuthGuard} from "@nestjs/passport";
import { Request } from 'express';
import {Usuario} from "../usuario/entities/usuario.entity";

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}


  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Req() req: Request): Promise<{ access_token: string }> {
    return this.authService.login(req.user! as Usuario);
  }

}
