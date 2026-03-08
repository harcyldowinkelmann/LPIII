import { BaseEntity, Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import Usuário from "./usuário";
import Avaliação from "./avaliação";

export enum EstiloRegência { 
    CLASSICO = "clássico", 
    SINFONICO = "sinfônico", 
    POPULAR = "popular", 
    CONTEMPORANEO = "contemporâneo" 
};

@Entity()
export default class Maestro extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    anosExperiência: number;

    @Column({ type: "enum", enum: EstiloRegência })
    estiloRegência: EstiloRegência;

    @OneToMany(() => Avaliação, (avaliação) => avaliação.maestro)
    avaliações: Avaliação[];

    @OneToOne(() => Usuário, (usuário) => usuário.maestro, { onDelete: "CASCADE" })
    @JoinColumn()
    usuário: Usuário;
}