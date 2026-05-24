import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import Maestro from "./maestro";
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

    @ManyToOne(() => Maestro, (maestro) => maestro.avaliações, { onDelete: "CASCADE" })
    maestro: Maestro;
}