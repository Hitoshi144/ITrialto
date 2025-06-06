import { Chat } from "src/chat/entities/chat.entity";
import { CreateTeamRequest } from "src/create-team-request/entities/create-team-request.entity";
import { Message } from "src/message/entities/message.entity";
import { Project } from "src/project/entities/project.entity";
import { TeamRequest } from "src/team-request/entities/team-request.entity";
import { Team } from "src/teams/entities/team.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    mail: string

    @Column()
    password: string

    @Column()
    firstname: string

    @Column()
    lastname: string

    @Column({default: ''})
    aboutMe: string

    @Column({default: ''})
    role: string

    @Column({default: ''})
    group: string

    @Column({default: ''})
    phone: string

    @CreateDateColumn()
    createAt: Date

    @UpdateDateColumn()
    updateAt: Date

    @ManyToMany(() => Team, (team) => team.members)
    @JoinTable()
    teams: Team[];

    @Column('int', { array: true, nullable: true })
    leaderOfTeams: number[];

    @OneToMany(() => Team, (team) => team.teamLeader)
    ledTeams: Team[];

    @OneToMany(() => TeamRequest, (teamRequest) => teamRequest.user)
    teamRequests: TeamRequest[];

    @OneToMany(() => CreateTeamRequest, (request) => request.creator)
    createTeamRequests: CreateTeamRequest[];

    @OneToMany(() => Project, (project) => project.user)
    projects: Project[];

    @Column('text', {array: true, nullable: true})
    competencies: string[];

    @ManyToMany(() => Chat, chat => chat.participants)
    chats: Chat[]

    @OneToMany(() => Message, message => message.sender)
    messages: Message[]
}
