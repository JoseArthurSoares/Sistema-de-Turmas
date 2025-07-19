import { Test, TestingModule } from '@nestjs/testing';
import { ParticipacaoService } from './participacao.service';
import {beforeEach, describe, it} from "node:test";

describe('ParticipacaoService', () => {
  let service: ParticipacaoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ParticipacaoService],
    }).compile();

    service = module.get<ParticipacaoService>(ParticipacaoService);
  });

  it('should be defined', () => {
  });
});
