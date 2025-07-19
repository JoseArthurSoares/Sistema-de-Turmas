import {Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique} from "typeorm";
import {Usuario} from "../../usuario/entities/usuario.entity";
import {Turma} from "../../turma/entities/turma.entity";

@Entity('participacoes')
@Unique(['usuario', 'turma'])
export class Participacao {

    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => Usuario, { onDelete: "CASCADE" })
    @JoinColumn({ name: "usuario_id" })
    usuario!: Usuario;

    @ManyToOne(() => Turma, { onDelete: "CASCADE" })
    @JoinColumn({ name: "turma_id" })
    turma!: Turma;


}
