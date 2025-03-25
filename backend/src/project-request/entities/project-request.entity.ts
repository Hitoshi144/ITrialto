import { Project } from "src/project/entities/project.entity";
import { Team } from "src/teams/entities/team.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ProjectRequest {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    teamId: number;

    @ManyToOne(() => Team, (team) => team.projectRequests)
    team: Team;

    @Column()
    projectId: number;

    @ManyToOne(() => Project, (project) => project.requests)
    project: Project;

    @Column({ 
        type: 'enum',
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    })
    status: 'pending' | 'approved' | 'rejected';

    @CreateDateColumn()
    createdAt: Date;
}
