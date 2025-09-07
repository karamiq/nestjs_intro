import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { FileTypes } from "./enums/file-types.enum";

@Entity()
export class Upload {
    @PrimaryGeneratedColumn()

    id: number;
    @Column(
        {
            type: 'varchar',
            length: 1024,
            nullable: false
        }
    )
    name: string;
    @Column(
        {
            type: 'varchar',
            length: 1024,
            nullable: false,
            default: FileTypes.IMAGE
        }
    )
    path: string;
    @Column({
        type: 'enum',
        enum: FileTypes,
        nullable: false
    })
    type: FileTypes;
    @Column(
        {
            type: 'varchar',
            length: 128,
            nullable: false
        }
    )
    mime: string;
    @Column(
        {
            type: 'varchar',
            length: 1024,
            nullable: false
        }
    )
    size: number;
    @CreateDateColumn()
    createdData: Date;
    @UpdateDateColumn()
    updatedData: Date;
}