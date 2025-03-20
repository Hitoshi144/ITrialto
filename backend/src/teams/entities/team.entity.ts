import { TeamRequest } from "src/team-request/entities/team-request.entity";
import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

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

    @OneToMany(() => User, (user) => user.team)
    teamMembers: User[];

    @CreateDateColumn()
    createdAt: Date

    @OneToMany(() => TeamRequest, (teamRequest) => teamRequest.team)
    teamRequests: TeamRequest[];
}
