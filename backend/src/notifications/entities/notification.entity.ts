import { Project } from "src/project/entities/project.entity";
import { Team } from "src/teams/entities/team.entity";
import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Notification {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    type: 'message' | 'system' | 'alert' | 'teamJoinRequest'

    @Column()
    message: string

    @ManyToOne(() => User, {nullable: false})
    @JoinColumn({name: 'fromUserId'})
    fromUser: User

    @Column({nullable: false})
    fromUserId: number

    @ManyToOne(() => User, {nullable: false})
    @JoinColumn({name: 'toUserId'})
    toUser: User
    
    @Column()
    toUserId: number

    @ManyToOne(() => Team, {nullable: true})
    @JoinColumn({name: 'teamId'})
    team?: Team
    
    @Column({nullable: true})
    teamId?: number

    @ManyToOne(() => Project, {nullable: true})
    @JoinColumn({name: 'projectId'})
    project?: Project
    
    @Column({nullable: true})
    projectId?: number

    @Column({default: false})
    isRead: boolean

    @CreateDateColumn()
    timestamp: Date
}
