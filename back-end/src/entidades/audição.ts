import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import Músico from "./músico";
import Avaliação from "./avaliação";

export enum Tipo { 
    ORQUESTRA = "orquestra", 
    CAMARA = "câmara", 
    BANDA = "banda", 
    SOLO = "solo" 
};

export enum StatusAudição { 
    ABERTA = "aberta", 
    EM_ANDAMENTO = "em andamento", 
    FINALIZADA = "finalizada" 
};

@Entity()
export default class Audição extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    título: string;

    @Column({ type: "enum", enum: Tipo })
    tipo: Tipo;

    @Column()
    naipe: string;

    @Column({ type: "date" })
    data_audicao: Date;

    @Column()
    descrição: string;

    @Column()
    remunerada: boolean;

    @Column({ type: "enum", enum: StatusAudição })
    status: StatusAudição;

    @ManyToOne(() => Músico, (músico) => músico.audições, { onDelete: "CASCADE" })
    músico: Músico;

    @OneToMany(() => Avaliação, (avaliação) => avaliação.audição)
    avaliações: Avaliação[];
}