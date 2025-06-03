import { Message } from "src/message/entities/message.entity";
import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Chat {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: true })
    name: string; // Для групповых чатов

    @Column({ default: false })
    isGroup: boolean; // Флаг группового чата

    @ManyToMany(() => User, user => user.chats)
    @JoinTable()
    participants: User[]; // Участники чата

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => Message, message => message.chat)
    messages: Message[];

    @ManyToOne(() => User, { nullable: true })
    createdBy: User; // Создатель чата
}
