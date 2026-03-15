import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import Músico from "./músico";
import Audição from "./audição";

@Entity()
export default class Avaliação extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    aprovado: boolean;

    @Column()
    parecer_tecnico: string;

    @CreateDateColumn()
    data_manifestação: Date;

    @ManyToOne(() => Audição, (audição) => audição.avaliações, { onDelete: "CASCADE" })
    audição: Audição;

    @ManyToOne(() => Músico, (músico) => músico.avaliações, { onDelete: "CASCADE" })
    músico: Músico;
}