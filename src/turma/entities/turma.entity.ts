import {Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Usuario} from "../../usuario/entities/usuario.entity";
import {Postagem} from "../../postagem/entities/postagem.entity";

@Entity('turmas')
export class Turma {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ length: 100 })
    nome!: string;

    @Column({ type: 'text', nullable: true })
    descricao?: string;

    @Column({ length: 10, unique: true })
    codigo_convite!: string;

    @ManyToOne(() => Usuario, (usuario) => usuario.turmas, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'professor_id' })
    professor!: Usuario;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    criadoEm!: Date;

    @OneToMany(() => Postagem, (postagem) => postagem.turma)
    postagens?: Postagem[];
}
