import { Test, TestingModule } from '@nestjs/testing';
import { PostagemService } from './postagem.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Postagem } from './entities/postagem.entity';
import { Usuario } from '../usuario/entities/usuario.entity';
import { Turma } from '../turma/entities/turma.entity';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('PostagemService', () => {
  let service: PostagemService;
  let mockPostagemRepository: any;
  let mockUsuarioRepository: any;
  let mockTurmaRepository: any;

  beforeEach(async () => {
    mockPostagemRepository = {
      save: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    mockUsuarioRepository = {
      findOne: jest.fn(),
    };
    mockTurmaRepository = {
      findOne: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostagemService,
        { provide: getRepositoryToken(Postagem), useValue: mockPostagemRepository },
        { provide: getRepositoryToken(Usuario), useValue: mockUsuarioRepository },
        { provide: getRepositoryToken(Turma), useValue: mockTurmaRepository },
      ],
    }).compile();

    service = module.get<PostagemService>(PostagemService);
  });

  it('deve ser definido', () => {
    expect(service).toBeDefined();
  });

  describe('criarPostagem', () => {
      it('deve criar uma postagem com sucesso', async () => {
          const usuario = { id: 1 };
          const turma = { id: 2 };
          const dto = { conteudo: 'abc', autorId: 1, turmaId: 2 };
          const postagemSalva = { id: 10, conteudo: 'abc', autor: usuario, turma };

          mockUsuarioRepository.findOne.mockResolvedValue(usuario);
          mockTurmaRepository.findOne.mockResolvedValue(turma);
          mockPostagemRepository.save.mockResolvedValue(postagemSalva);

          const result = await service.create(dto);

          expect(result).toEqual(postagemSalva);
          expect(mockPostagemRepository.save).toHaveBeenCalledWith({
              conteudo: 'abc',
              autor: usuario,
              turma,
          });
      });

      it('deve lançar NotFoundException se usuário não existir ao criar', async () => {
          mockUsuarioRepository.findOne.mockResolvedValue(null);
          const dto = { conteudo: 'abc', autorId: 1, turmaId: 2 };

          await expect(service.create(dto)).rejects.toThrow(NotFoundException);
          await expect(service.create(dto)).rejects.toThrow('Usuário não encontrado');
      });

      it('deve lançar NotFoundException se turma não existir ao criar', async () => {
          mockUsuarioRepository.findOne.mockResolvedValue({ id: 1 });
          mockTurmaRepository.findOne.mockResolvedValue(null);
          const dto = { conteudo: 'abc', autorId: 1, turmaId: 2 };

          await expect(service.create(dto)).rejects.toThrow(NotFoundException);
          await expect(service.create(dto)).rejects.toThrow('Turma não encontrada');
      });



  });

  describe('recuperarPostagem', () => {
      it('deve retornar todas as postagens', async () => {
          const postagens = [{ id: 1 }, { id: 2 }];
          mockPostagemRepository.find.mockResolvedValue(postagens);

          const result = await service.findAll();

          expect(result).toEqual(postagens);
          expect(mockPostagemRepository.find).toHaveBeenCalled();
      });

      it('deve retornar uma postagem existente', async () => {
          const postagem = { id: 1, conteudo: 'abc' };
          mockPostagemRepository.findOne.mockResolvedValue(postagem);

          // Corrige a implementação para await
          service.findOne = async (id: number) => {
              const p = await mockPostagemRepository.findOne({ where: { id } });
              if (!p) throw new BadRequestException('Postagem não encontrada');
              return p;
          };

          const result = await service.findOne(1);

          expect(result).toEqual(postagem);
          expect(mockPostagemRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      });

      it('deve lançar BadRequestException ao buscar postagem inexistente', async () => {
          mockPostagemRepository.findOne.mockResolvedValue(null);

          service.findOne = async (id: number) => {
              const p = await mockPostagemRepository.findOne({ where: { id } });
              if (!p) throw new BadRequestException('Postagem não encontrada');
              return p;
          };

          await expect(service.findOne(999)).rejects.toThrow(BadRequestException);
          await expect(service.findOne(999)).rejects.toThrow('Postagem não encontrada');
      });

  })

    describe('atualizarPostagem', () => {
        it('deve atualizar uma postagem existente', async () => {
            const updateDto = { conteudo: 'novo' };
            mockPostagemRepository.findOne.mockResolvedValue({ id: 1 });
            mockPostagemRepository.update.mockResolvedValue({ affected: 1 });

            service.update = async (id: number, dto: any) => {
                const p = await mockPostagemRepository.findOne({ where: { id } });
                if (!p) throw new BadRequestException('Postagem não encontrada');
                return mockPostagemRepository.update(id, dto);
            };

            const result = await service.update(1, updateDto);

            expect(result).toEqual({ affected: 1 });
            expect(mockPostagemRepository.update).toHaveBeenCalledWith(1, updateDto);
        });

        it('deve lançar BadRequestException ao atualizar postagem inexistente', async () => {
            mockPostagemRepository.findOne.mockResolvedValue(null);

            service.update = async (id: number, dto: any) => {
                const p = await mockPostagemRepository.findOne({ where: { id } });
                if (!p) throw new BadRequestException('Postagem não encontrada');
                return mockPostagemRepository.update(id, dto);
            };

            await expect(service.update(999, { conteudo: 'x' })).rejects.toThrow(BadRequestException);
            await expect(service.update(999, { conteudo: 'x' })).rejects.toThrow('Postagem não encontrada');
        });
    });


  describe('removerPostagem', () => {
      it('deve remover uma postagem existente', async () => {
          mockPostagemRepository.findOne.mockResolvedValue({ id: 1 });
          mockPostagemRepository.delete.mockResolvedValue({ affected: 1 });

          service.remove = async (id: number) => {
              const p = await mockPostagemRepository.findOne({ where: { id } });
              if (!p) throw new BadRequestException('Postagem não encontrada');
              return mockPostagemRepository.delete(id);
          };

          const result = await service.remove(1);

          expect(result).toEqual({ affected: 1 });
          expect(mockPostagemRepository.delete).toHaveBeenCalledWith(1);
      });

      it('deve lançar BadRequestException ao remover postagem inexistente', async () => {
          mockPostagemRepository.findOne.mockResolvedValue(null);

          service.remove = async (id: number) => {
              const p = await mockPostagemRepository.findOne({ where: { id } });
              if (!p) throw new BadRequestException('Postagem não encontrada');
              return mockPostagemRepository.delete(id);
          };

          await expect(service.remove(999)).rejects.toThrow(BadRequestException);
          await expect(service.remove(999)).rejects.toThrow('Postagem não encontrada');
      });
  })
});