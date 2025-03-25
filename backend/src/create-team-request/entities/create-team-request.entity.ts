import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class CreateTeamRequest {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column({default: ''})
    description: string;

    @Column()
    creatorId: number;

    @ManyToOne(() => User, (user) => user.createTeamRequests)
    creator: User;

    @Column({default: 'pending'})
    status: 'pending' | 'approved' | 'rejected';

    @CreateDateColumn()
    createdAt: Date;
}
