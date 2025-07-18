import { Test, TestingModule } from '@nestjs/testing';
import { UsuarioService } from './usuario.service';
import {beforeEach, describe, it} from "node:test";

describe('UsuarioService', () => {
  let service: UsuarioService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsuarioService],
    }).compile();

    service = module.get<UsuarioService>(UsuarioService);
  });

  it('should be defined', () => {
  });
});
