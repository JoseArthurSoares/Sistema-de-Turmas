import { ParticipacaoService } from './participacao.service';
import { NotFoundException, ConflictException } from '@nestjs/common';

describe('ParticipacaoService', () => {
    let service: ParticipacaoService;
    let mockParticipacaoRepository: any;
    let mockUsuarioRepository: any;
    let mockTurmaRepository: any;

    beforeEach(() => {
        mockParticipacaoRepository = {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
        };
        mockUsuarioRepository = {
            findOne: jest.fn(),
        };
        mockTurmaRepository = {
            findOne: jest.fn(),
        };

        service = new ParticipacaoService(
            mockParticipacaoRepository,
            mockTurmaRepository,
            mockUsuarioRepository,
        );
    });

    describe('criarParticipacao', () => {
        it('deve criar participação com aluno com sucesso', async () => {
            const usuario = { id: 1, tipo_usuario: 'ALUNO' };
            const turma = { id: 1 };
            const participacaoCriada = { id: 1, usuario, turma };

            mockUsuarioRepository.findOne.mockResolvedValue(usuario);
            mockTurmaRepository.findOne.mockResolvedValue(turma);
            mockParticipacaoRepository.create.mockReturnValue(participacaoCriada);
            mockParticipacaoRepository.save.mockResolvedValue(participacaoCriada);

            const dto = { usuarioId: 1, turmaId: 1 };
            const result = await service.create(dto);

            expect(result).toEqual(participacaoCriada);
            expect(mockParticipacaoRepository.save).toHaveBeenCalledWith(participacaoCriada);
        });

        it('deve criar participação com professor com sucesso', async () => {
            const usuario = { id: 2, tipo_usuario: 'PROFESSOR' };
            const turma = { id: 1 };
            const participacaoCriada = { id: 2, usuario, turma };

            mockUsuarioRepository.findOne.mockResolvedValue(usuario);
            mockTurmaRepository.findOne.mockResolvedValue(turma);
            mockParticipacaoRepository.create.mockReturnValue(participacaoCriada);
            mockParticipacaoRepository.save.mockResolvedValue(participacaoCriada);

            const dto = { usuarioId: 2, turmaId: 1 };
            const result = await service.create(dto);

            expect(result).toEqual(participacaoCriada);
            expect(mockParticipacaoRepository.save).toHaveBeenCalledWith(participacaoCriada);
        });

        it('deve criar participação com aluno em turma que já possui alunos', async () => {
            const usuario = { id: 3, tipo_usuario: 'ALUNO' };
            const turma = { id: 1, participacoes: [{ usuario: { id: 4, tipo_usuario: 'ALUNO' } }] };
            const participacaoCriada = { id: 3, usuario, turma };

            mockUsuarioRepository.findOne.mockResolvedValue(usuario);
            mockTurmaRepository.findOne.mockResolvedValue(turma);
            mockParticipacaoRepository.create.mockReturnValue(participacaoCriada);
            mockParticipacaoRepository.save.mockResolvedValue(participacaoCriada);

            const dto = { usuarioId: 3, turmaId: 1 };
            const result = await service.create(dto);

            expect(result).toEqual(participacaoCriada);
        });

        it('deve lançar ConflictException ao tentar criar participação de professor em turma que já possui professor', async () => {
            const usuario = { id: 5, tipo_usuario: 'PROFESSOR' };
            const turma = { id: 1 };

            mockUsuarioRepository.findOne.mockResolvedValue(usuario);
            mockTurmaRepository.findOne.mockResolvedValue(turma);

            mockParticipacaoRepository.findOne.mockResolvedValue({
                id: 99,
                usuario: { id: 6, tipo_usuario: 'PROFESSOR' },
                turma: { id: 1 },
            });

            const dto = { usuarioId: 5, turmaId: 1 };

            await expect(service.create(dto)).rejects.toThrow(ConflictException);
            await expect(service.create(dto)).rejects.toThrow(
                'Só é possível cadastrar um professor por turma.',
            );
        });


        it('deve lançar NotFoundException ao tentar criar participação com usuário inexistente', async () => {
            mockUsuarioRepository.findOne.mockResolvedValue(null);

            const dto = { usuarioId: 999, turmaId: 1 };

            await expect(service.create(dto)).rejects.toThrow(NotFoundException);
            await expect(service.create(dto)).rejects.toThrow('Usuário não foi encontrado');
        });

        it('deve lançar NotFoundException ao tentar criar participação com turma inexistente', async () => {
            const usuario = { id: 1, tipo_usuario: 'ALUNO' };
            mockUsuarioRepository.findOne.mockResolvedValue(usuario);
            mockTurmaRepository.findOne.mockResolvedValue(null);

            const dto = { usuarioId: 1, turmaId: 999 };

            await expect(service.create(dto)).rejects.toThrow(NotFoundException);
            await expect(service.create(dto)).rejects.toThrow('Turma não foi encontrada');
        });
    });

    describe('obterParticipacao', () => {
        it('deve retornar os detalhes de uma participação existente', async () => {
            const participacao = { id: 1, usuario: { id: 1 }, turma: { id: 1 } };
            mockParticipacaoRepository.findOne.mockResolvedValue(participacao);

            const result = await service.findOne(1);

            expect(result).toEqual(participacao);
            expect(mockParticipacaoRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
        });

        it('deve lançar NotFoundException ao tentar obter uma participação inexistente', async () => {
            mockParticipacaoRepository.findOne.mockResolvedValue(null);

            await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
            await expect(service.findOne(999)).rejects.toThrow('Participação não foi encontrada');
        });
    });

    describe('removerParticipacao', () => {
        it('deve lançar NotFoundException ao tentar excluir uma participação inexistente', async () => {
            mockParticipacaoRepository.delete = jest.fn().mockResolvedValue({ affected: 0 });

            await expect(service.remove(999)).rejects.toThrow(NotFoundException);
            await expect(service.remove(999)).rejects.toThrow('Participação não foi encontrada');
        });
    })

});
