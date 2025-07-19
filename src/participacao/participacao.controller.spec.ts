import { Test, TestingModule } from '@nestjs/testing';
import { ParticipacaoController } from './participacao.controller';
import { ParticipacaoService } from './participacao.service';
import {beforeEach, describe, it} from "node:test";

describe('ParticipacaoController', () => {
  let controller: ParticipacaoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ParticipacaoController],
      providers: [ParticipacaoService],
    }).compile();

    controller = module.get<ParticipacaoController>(ParticipacaoController);
  });

  it('should be defined', () => {
  });
});
