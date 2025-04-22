import { Project } from "src/project/entities/project.entity";
import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { JoinAttribute } from "typeorm/query-builder/JoinAttribute";

@Entity()
export class Rialto {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    title: string

    @OneToMany(() => Project, (project) => project.rialtoId)
    projects: Project[]
}
