import { Post } from 'src/posts/post.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class MetaOption {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'json',
    nullable: false,
  })
  metaValue: string;

  @CreateDateColumn()
  createDate: Date;

  @UpdateDateColumn()
  updateDate: Date;

  
  @OneToOne(
    // This is the side of the relation that will create a foreign key in the Post table.
    // it will create a foreign key in the Post table that will reference the MetaOption table.
    // so we can access the meta options from the post.
    // we'll use this to get the meta options from the post.
    // the Post define the entity that will be referenced by the foreign key.
    // the Post entity is the one that will have the foreign key to the MetaOption entity.
    ()=> Post, 
  // This is the inverse side of the relation,
  // it will not create a foreign key in the Post table.
  // but it will allow us to access the Post from the MetaOption.
  // its like we can get the post from the meta options 
  // and not only from the post to the meta options.
  // we'll use this to get the post from the meta options.
  // so we'll do the same thing in the Post entity
  (post) => post.metaOptions, {
    //cascade: true, // This will allow us to create, update and delete the meta options when the post is created, updated or deleted.
    onDelete: 'CASCADE', // This will delete the meta options when the post is deleted.
  }
 )
 // This is the foreign key that will reference the Post table.
 // the reason we moved the foreign key to the MetaOption entity is that
 // when removing a post, we want to remove the meta options as well.
  // so we can remove the meta options when removing the post.
 
 // IF WE REMOVE THE FOREIGN KEY ENTITY
 // THE PRIMAY KEY WILL NOT BE REMOVED
 // FORIEGN KEY
  @JoinColumn()
  post:Post;
}