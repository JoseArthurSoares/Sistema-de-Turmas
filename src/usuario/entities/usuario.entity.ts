import {Column, CreateDateColumn, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity('usuarios')
export class Usuario {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ length: 100 })
    nome!: string;

    @Column({ length: 100, unique: true })
    email!: string;

    @Column({ length: 255 })
    senha!: string;

    @Column({
        type: 'varchar',
        length: 20,
    })
    tipo_usuario!: 'professor' | 'aluno';

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    criado_em!: Date;
}
