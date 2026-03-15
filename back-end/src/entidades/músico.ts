import { BaseEntity, Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import Usuário from "./usuário";
import Avaliação from "./avaliação";

export enum NívelExperiência { 
    INICIANTE = "iniciante", 
    INTERMEDIARIO = "intermediário", 
    AVANCADO = "avançado", 
    PROFISSIONAL = "profissional" 
};

@Entity()
export default class Músico extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    instrumentoPrincipal: string;

    @Column({ type: "enum", enum: NívelExperiência })
    nívelExperiência: NívelExperiência;

    @OneToMany(() => Avaliação, (avaliação) => avaliação.músico)
    avaliações: Avaliação[];

    @OneToOne(() => Usuário, (usuário) => usuário.músico, { onDelete: "CASCADE" })
    @JoinColumn()
    usuário: Usuário;
}