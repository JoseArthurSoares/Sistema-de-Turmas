jest.mock('bcrypt');
import { Test, TestingModule } from '@nestjs/testing';
import { UsuarioService } from './usuario.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Usuario } from './entities/usuario.entity';
import * as bcrypt from 'bcrypt';
import { NotFoundException } from '@nestjs/common';
import {TipoUsuario} from "./dto/create-usuario.dto";


const createUsuarioDto = {
    nome: 'Professor Teste',
    email: 'prof@teste.com',
    senha: '12345678',
    tipo_usuario: TipoUsuario.PROFESSOR,
};


describe('UsuarioService', () => {
    let service: UsuarioService;
    let mockUsuarioRepository: any;

    beforeEach(async () => {
        mockUsuarioRepository = {
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsuarioService,
                {
                    provide: getRepositoryToken(Usuario),
                    useValue: mockUsuarioRepository,
                },
            ],
        }).compile();

        service = module.get<UsuarioService>(UsuarioService);
    });

    it('deve ser definido', () => {
        expect(service).toBeDefined();
    });

    describe('criarUsuario', () => {
        it('deve criar um usuário com senha hash', async () => {
            const usuarioSalvo = { id: 1, email: createUsuarioDto.email, senha: 'hash' };

            (bcrypt.hash as jest.Mock).mockResolvedValue('hash');
            mockUsuarioRepository.save.mockResolvedValue(usuarioSalvo);

            const result = await service.create({ ...createUsuarioDto });

            expect(bcrypt.hash).toHaveBeenCalledWith(createUsuarioDto.senha, 10);
            expect(mockUsuarioRepository.save).toHaveBeenCalledWith({ ...createUsuarioDto, senha: 'hash' });
            expect(result).toEqual(usuarioSalvo);
        });
    })

    describe('recuperaUsuario', () => {
        it('deve retornar todos os usuários', async () => {
            const usuarios = [{ id: 1 }, { id: 2 }];
            mockUsuarioRepository.find.mockResolvedValue(usuarios);

            const result = await service.findAll();

            expect(result).toEqual(usuarios);
            expect(mockUsuarioRepository.find).toHaveBeenCalled();
        });

        it('deve retornar um usuário pelo email', async () => {
            const usuario = { id: 1, email: 'a@a.com' };
            mockUsuarioRepository.findOne.mockResolvedValue(usuario);

            const result = await service.findOneByEmail('a@a.com');

            expect(result).toEqual(usuario);
            expect(mockUsuarioRepository.findOne).toHaveBeenCalledWith({ where: { email: 'a@a.com' } });
        });

        it('deve retornar NoFoundException se usuário não existir', async () => {
            mockUsuarioRepository.findOne.mockResolvedValue(null);

            await expect(service.findOneByEmail('naoexiste@a.com')).rejects.toThrow(
                new NotFoundException('Usuário não encontrado')
            );
            expect(mockUsuarioRepository.findOne).toHaveBeenCalledWith({ where: { email: 'naoexiste@a.com' } });
        });
    })

    describe('atualizaUsuario', () => {
        it('deve atualizar um usuário', async () => {
            const updateDto = { nome: 'Novo Nome', email: 'novoemail@gmail.com'};
            mockUsuarioRepository.findOne.mockResolvedValue({ id: 1, nome: 'Antigo Nome', email: 'teste@gmail.com' });
            mockUsuarioRepository.update.mockResolvedValue({ affected: 1 });

            const result = await service.update(1, updateDto);

            expect(mockUsuarioRepository.update).toHaveBeenCalledWith(1, updateDto);
            expect(result).toEqual({ affected: 1 });
        });

        it('deve lançar NotFoundException ao tentar atualizar usuário inexistente', async () => {
            const updateDto = { nome: 'Novo Nome', email: 'novoemail@gmail.com'};
            mockUsuarioRepository.update.mockResolvedValue({ affected: 0 });

            await expect(service.update(999, updateDto)).rejects.toThrow(
                new NotFoundException('Usuário não encontrado')
            );
        });
    })


    /*



    it('deve remover um usuário existente', async () => {
        mockUsuarioRepository.delete.mockResolvedValue({ affected: 1 });

        const result = await service.remove(1);

        expect(mockUsuarioRepository.delete).toHaveBeenCalledWith(1);
        expect(result).toEqual({ affected: 1 });
    });

    it('deve lançar NotFoundException ao tentar remover usuário inexistente', async () => {
        mockUsuarioRepository.delete.mockResolvedValue({ affected: 0 });

        service.remove = async (id: number) => {
            const result = await mockUsuarioRepository.delete(id);
            if (result.affected === 0) {
                throw new NotFoundException('Usuário não encontrado');
            }
            return result;
        };

        await expect(service.remove(999)).rejects.toThrow(NotFoundException);
        await expect(service.remove(999)).rejects.toThrow('Usuário não encontrado');
    });

     */
});