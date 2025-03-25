import { ProjectRequest } from "src/project-request/entities/project-request.entity";
import { Team } from "src/teams/entities/team.entity";
import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Project {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column({ type: 'text' })
    problem: string;

    @Column({ type: 'text' })
    solution: string;

    @Column({ type: 'text' })
    expectedResult: string;

    @Column({ type: 'text' })
    stack: string;

    @Column({ nullable: true })
    customer: string;

    @Column({ type: 'text', nullable: true })
    comment: string | null; // Комментарий при отклонении/отправке на доработку

    @Column({ 
        type: 'enum',
        enum: ['pending', 'published', 'in_progress', 'revision', 'rejected', 'completed'],
        default: 'pending'
    })
    status: 'pending' | 'published' | 'in_progress' | 'revision' | 'rejected' | 'completed';

    @Column()
    userId: number; // Создатель проекта

    @ManyToOne(() => User, (user) => user.projects)
    user: User;

    @Column({ nullable: true })
    teamId: number | null; // Команда, работающая над проектом

    @ManyToOne(() => Team, (team) => team.projects)
    team: Team;

    @CreateDateColumn()
    createdAt: Date;

    @OneToMany(() => ProjectRequest, (request) => request.project)
    requests: ProjectRequest[];
}
