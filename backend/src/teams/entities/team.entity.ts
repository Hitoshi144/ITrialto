import { ProjectRequest } from "src/project-request/entities/project-request.entity";
import { Project } from "src/project/entities/project.entity";
import { TeamRequest } from "src/team-request/entities/team-request.entity";
import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Team {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    title: string

    @Column({default: ''})
    description: string

    @Column({ nullable: true })
    teamLeaderId: number;

    @ManyToOne(() => User, (user) => user.ledTeams)
    @JoinColumn({ name: 'teamLeaderId' })
    teamLeader: User;

    @Column('int', { array: true, nullable: true })
    members: number[];

    @ManyToMany(() => User, (user) => user.teams)
    @JoinTable()
    teamMembers: User[];

    @Column({default: 'close'})
    status: string

    @CreateDateColumn()
    createdAt: Date

    @OneToMany(() => TeamRequest, (teamRequest) => teamRequest.team)
    teamRequests: TeamRequest[];

    @OneToMany(() => Project, (project) => project.team)
    projects: Project[];

    @Column({ nullable: true })
    currentProjectId: number | null; // Проект, над которым сейчас работает команда

    @ManyToOne(() => Project, (project) => project.team)
    currentProject: Project;

    @OneToMany(() => ProjectRequest, (request) => request.team)
    projectRequests: ProjectRequest[];
}
