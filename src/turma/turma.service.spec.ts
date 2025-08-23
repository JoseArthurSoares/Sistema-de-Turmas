import { Test, TestingModule } from '@nestjs/testing';
import { TurmaService } from './turma.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Turma } from './entities/turma.entity';
import { Repository } from 'typeorm';
import { Usuario } from '../usuario/entities/usuario.entity';
import {ConflictException, NotFoundException} from '@nestjs/common';
import {TipoUsuario} from "../usuario/dto/create-usuario.dto";

const professorUser: Usuario = {
    id: 1,
    nome: 'Professor Teste',
    email: 'prof@teste.com',
    senha: '12345678',
    tipo_usuario: TipoUsuario.PROFESSOR,
    criado_em: new Date(),
};


const createTurmaDto = {
    nome: 'Nova Turma de Teste',
    descricao: 'Uma descrição detalhada da turma.',
    codigo_convite: 'CODIGO123',
    professorId: 1
};

describe('TurmaService', () => {
    let service: TurmaService;
    let repository: Repository<Turma>;

    const mockTurmaRepository = {
        create: jest.fn(),
        save: jest.fn(),
        findOne: jest.fn(),
        update: jest.fn(),
        delete: jest.fn()
    };

    const mockUsuarioRepository = {
        create: jest.fn(),
        save: jest.fn(),
        findOne: jest.fn(),
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TurmaService,
                {
                    provide: getRepositoryToken(Turma),
                    useValue: mockTurmaRepository,
                },
            ],
        }).compile();

        service = module.get<TurmaService>(TurmaService);
        repository = module.get<Repository<Turma>>(getRepositoryToken(Turma));

        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('criarTurma', () => {
        it('deve criar uma turma com sucesso quando o usuário é um professor', async () => {
            // Arrange
            mockTurmaRepository.findOne.mockResolvedValue(null);
            mockTurmaRepository.create.mockReturnValue(createTurmaDto as any);
            mockTurmaRepository.save.mockResolvedValue({ id: 1, ...createTurmaDto } as any);
            mockUsuarioRepository.save(professorUser);


            // Act
            const result = await service.create(createTurmaDto);

            // Assert
            expect(result).toBeDefined();
            expect(result.nome).toEqual(createTurmaDto.nome);
            expect(repository.save).toHaveBeenCalledTimes(1);
        });


        it('deve criar uma turma com sucesso mesmo com a descrição vazia', async () => {
            // Arrange
            const dtoSemDescricao = { ...createTurmaDto, descricao: '' };
            mockTurmaRepository.findOne.mockResolvedValue(null);
            mockTurmaRepository.create.mockReturnValue(dtoSemDescricao as any);
            mockTurmaRepository.save.mockResolvedValue({ id: 1, ...dtoSemDescricao } as any);

            // Act
            const result = await service.create(dtoSemDescricao);

            // Assert
            expect(result).toBeDefined();
            expect(result.descricao).toEqual('');
            expect(repository.save).toHaveBeenCalledTimes(1);
        });




        it('deve lançar ConflictException se já existir uma turma com o mesmo nome', async () => {
            // Arrange
            mockTurmaRepository.findOne.mockImplementation((options) => {
                if (options.where.nome === createTurmaDto.nome) {
                    return Promise.resolve({ id: 1, ...createTurmaDto });
                }
                return Promise.resolve(null);
            });

            // Act & Assert
            await expect(service.create(createTurmaDto)).rejects.toThrow(
                new ConflictException('Uma turma com este nome já existe.'),
            );
        });


        it('deve lançar ConflictException se já existir uma turma com o mesmo código de convite', async () => {
            // Arrange
            mockTurmaRepository.findOne.mockImplementation((options) => {
                if (options.where.codigo_convite === createTurmaDto.codigo_convite) {
                    return Promise.resolve({ id: 'uuid-existente', ...createTurmaDto });
                }
                return Promise.resolve(null);
            });

            // Act & Assert
            await expect(service.create(createTurmaDto)).rejects.toThrow(
                new ConflictException('Este código de convite já está em uso.'),
            );
        });
    });

    describe('obterTurma', () => {
        it('deve retornar os detalhes de uma turma existente', async () => {
            // Arrange
            const turmaExistente = { id: 1, ...createTurmaDto };
            mockTurmaRepository.findOne.mockResolvedValue(turmaExistente);

            // Act
            const result = await service.findOne(1);

            // Assert
            expect(result).toEqual(turmaExistente);
            expect(mockTurmaRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
        });

        it('deve lançar NotFoundException ao buscar uma turma inexistente', async () => {
            // Arrange
            mockTurmaRepository.findOne.mockResolvedValue(null);

            // Act & Assert
            await expect(service.findOne(999)).rejects.toThrow(
                new NotFoundException('Turma não encontrada.')
            );
            expect(mockTurmaRepository.findOne).toHaveBeenCalledWith({ where: { id: 999 } });
        });
    });

    describe('atualizarTurma', () => {
        it('deve atualizar os dados de uma turma existente', async () => {
            // Arrange
            const id = 1;
            const updateDto = { nome: 'Turma Atualizada', descricao: 'Nova descrição' };
            const turmaExistente = { id, ...createTurmaDto };
            mockTurmaRepository.findOne.mockResolvedValue(turmaExistente);
            mockTurmaRepository.update.mockResolvedValue({ affected: 1 });
            mockTurmaRepository.save?.mockResolvedValue({ id, ...updateDto });

            // Act
            await service.update(id, updateDto);

            // Assert
            expect(mockTurmaRepository.update).toHaveBeenCalledWith(id, updateDto);
        });

        it('deve lançar NotFoundException ao tentar atualizar uma turma inexistente', async () => {
            // Arrange
            const id = 999;
            const updateDto = { nome: 'Turma Inexistente' };
            mockTurmaRepository.findOne.mockResolvedValue(null);

            // Act & Assert
            await expect(service.update(id, updateDto)).rejects.toThrow(
                new NotFoundException('Turma não encontrada.')
            );
        });

        it('deve lançar ConflictException ao tentar atualizar para um nome já existente', async () => {
            // Arrange
            const id = 1;
            const updateDto = { nome: 'NomeExistente' };
            const turmaExistente = { id, ...createTurmaDto };
            const outraTurma = { id: 2, nome: 'NomeExistente' };

            mockTurmaRepository.findOne
                .mockResolvedValueOnce(turmaExistente)
                .mockResolvedValueOnce(outraTurma);


            // Act & Assert
            await expect(service.update(id, updateDto)).rejects.toThrow(
                new ConflictException('Uma turma com este nome já existe.')
            );
        });
    });

    describe('excluirTurma', () => {
        it('deve lançar NotFoundException ao tentar excluir uma turma inexistente', async () => {
            // Arrange
            const id = 999;
            mockTurmaRepository.findOne.mockResolvedValue(null);

            // Act & Assert
            await expect(service.remove(id)).rejects.toThrow(
                new NotFoundException('Turma não encontrada.')
            );
        });
    });
});