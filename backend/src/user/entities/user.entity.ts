import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

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
}
