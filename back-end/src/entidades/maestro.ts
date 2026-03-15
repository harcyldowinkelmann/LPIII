import { BaseEntity, Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import Usuário from "./usuário";
import Audição from "./audição";

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

    @OneToMany(() => Audição, (audição) => audição.maestro)
    audições: Audição[];

    @OneToOne(() => Usuário, (usuário) => usuário.maestro, { onDelete: "CASCADE" })
    @JoinColumn()
    usuário: Usuário;
}