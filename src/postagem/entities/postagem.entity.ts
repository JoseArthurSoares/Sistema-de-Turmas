import {Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Usuario} from "../../usuario/entities/usuario.entity";
import {Turma} from "../../turma/entities/turma.entity";

@Entity('postagens')
export class Postagem {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: 'text', nullable: false })
    conteudo!: string;

    @ManyToOne(() => Usuario, (autor) => autor.postagens, { nullable: true })
    @JoinColumn({ name: 'autor_id' })
    autor!: Usuario;

    @ManyToOne(() => Turma, (turma) => turma.postagens, { nullable: true })
    @JoinColumn({ name: 'turma_id' })
    turma!: Turma;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    criado_em!: Date;
}
