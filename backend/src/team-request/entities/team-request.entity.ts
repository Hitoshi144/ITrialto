import { Team } from "src/teams/entities/team.entity";
import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class TeamRequest {
    @PrimaryGeneratedColumn()
    id: number

  @ManyToOne(() => User, (user) => user.teamRequests)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: number;

  @ManyToOne(() => Team, (team) => team.teamRequests)
  @JoinColumn({ name: 'teamId' })
  team: Team;

  @Column()
  teamId: number;

  @Column({ default: 'pending' }) // Статус запроса: pending, approved, rejected
  status: string;

  @CreateDateColumn()
  createdAt: Date;
}
