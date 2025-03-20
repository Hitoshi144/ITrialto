import { TeamRequest } from "src/team-request/entities/team-request.entity";
import { Team } from "src/teams/entities/team.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

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
    role: string

    @Column({default: ''})
    group: string

    @Column({default: ''})
    phone: string

    @CreateDateColumn()
    createAt: Date

    @UpdateDateColumn()
    updateAt: Date

    @Column({ nullable: true })
    teamId: number | null;

    @ManyToOne(() => Team, (team) => team.members)
    team: Team;

    @Column('int', { array: true, nullable: true })
    leaderOfTeams: number[];

    @OneToMany(() => Team, (team) => team.teamLeader)
    ledTeams: Team[];

    @OneToMany(() => TeamRequest, (teamRequest) => teamRequest.user)
    teamRequests: TeamRequest[];
}
