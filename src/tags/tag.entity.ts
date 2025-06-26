import { Post } from 'src/posts/post.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Tag {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({
    type: 'varchar',
    length: 256,
    nullable: false,
    unique: true,
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 256,
    nullable: false,
    unique: true,
  })
  slug: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  description: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  schema: string;

  @Column({
    type: 'varchar',
    length: 1024,
    nullable: true,
  })
  featuredImage: string;

  @ManyToMany(() => Post, (post) => post.tags,
    {
      // since the entity is many to many we cant just delete the tag
      // we need to delete the relation
      // so we use the onDelete: 'CASCADE' option
      // this will delete the relation between the tag and the post
      // but not the post itself
      // if you want to delete the post as well, you can use the onDelete: 'CASCADE' option in the post.entity.ts file
      // but this will delete the post
      // so be careful with this option

      // now when the tag is deleted, the relation between the tag and the post will be deleted
      // but the post will not be deleted
      onDelete: 'CASCADE',
    })
  posts: Post[];

  // https://orkhan.gitbook.io/typeorm/docs/decorator-reference
  @CreateDateColumn()
  createDate: Date;

  @UpdateDateColumn()
  updateDate: Date;

  // Add this decorartor and column enables soft delete
  @DeleteDateColumn()
  deletedAt: Date;
}