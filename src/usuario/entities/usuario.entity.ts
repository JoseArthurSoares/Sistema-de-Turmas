import {Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Turma} from "../../turma/entities/turma.entity";

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
        nullable: false,
    })
    tipo_usuario!: string;

    @OneToMany(() => Turma, (turma) => turma.professor)
    turmas?: Turma[];

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    criado_em!: Date;
}
