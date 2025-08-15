import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { postStatus } from './enums/postStatus.enum';
import { postType } from './enums/postType.enum';
import { MetaOption } from 'src/meta-options/meta-option.entity';
import { User } from 'src/users/user.entity';
import { Tag } from 'src/tags/tag.entity';

@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 512,
    nullable: false,
  })
  title: string;

  @Column({
    type: 'enum',
    enum: postType,
    nullable: false,
    default: postType.POST,
  })
  postType: postType;

  @Column({
    type: 'varchar',
    length: 256,
    nullable: false,
    unique: true,
  })
  slug: string;

  @Column({
    type: 'enum',
    enum: postStatus,
    nullable: false,
    default: postStatus.DRAFT,
  })
  status: postStatus;

  @Column({
    type: 'text',
    nullable: true,
  })
  content?: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  schema?: string;

  @Column({
    type: 'varchar',
    length: 1024,
    nullable: true,
  })
  featuredImageUrl?: string;

  @Column({
    type: 'timestamp', // 'datetime' in mysql
    nullable: true,
  })
  publishOn?: Date;

  //  This will hold the foreign key to the User table.
  // that's because of the ManyToOne relation
  // it will create a foreign key in the Post table that will reference the User table
  @ManyToOne(() => User, (user) => user.posts, {

    // just like the eager in the MetaOption entity
    // this will automatically load the author when the Post is loaded
    //howver im gonna disable it and ask the user to be loaded
    // from the relations just for the sake of the exmple

    // i made the pagination query generic
    // and to keep loading the auther as well i have enabled the eager to true
    // because i want to keep the author along with the post
    eager: true,
  }
  )
  author: User;

  @ManyToMany(() => Tag, (tag) => tag.posts, {
    eager: true,
  })
  // This will create a many-to-many relation between Post and Tag
  // it will create a join table that will hold the foreign keys to both tables

  // it also makes the Post entity is the owning side of the relationship
  // and whenever a post is deleted the realated tags will be removed as well

  // it will not delete the tags themselves from the Tag table
  // but it will remove the relation between the Post and the Tag
  // in the manty-to-many relationship
  @JoinTable()

  tags?: Tag[];

  @OneToOne(() => MetaOption,

    // This is the inverse side of the relation,
    // it will not create a foreign key in the Post table.
    // but it will allow us to access the Post from the MetaOption.
    // its like we can get the post from the meta options
    // we did it in the MetaOption entity and if we dont do it here it will only 
    // create a foreign key in the Post table that will reference the MetaOption table
    // we will not be able to access the meta options from the post.
    // and not only from the post to the meta options.
    // we'll use this to get the meta options from the post.
    // so we'll do the same thing in the Post entity
    // the first parameter is the entity that will be referenced by the foreign key.
    // the second parameter is the inverse side of the relation,
    // it will not create a foreign key in the Post table.
    // but it will allow us to access the Post from the MetaOption.
    (metaOptions) => metaOptions.post,

    {
      // This will allow the metaOptions to be created/updated when the Post is created/updated
      // so when we used to first creat metaOptions  where whe check if the DTO has metaOptions
      // and then create the metaOptions and then create the post
      // now we can just pass the metaOptions in the DTO and it will be created/updated automatically
      // This is called cascade in TypeORM
      //    cascade: true,
      // while it can controll the cascade operations like insert, update, remove, soft-remove, recover
      // but we will use cascade: true to allow all operations
      // and it can be specified as an array of operations like 
      //  cascade: ['insert', 'update'] depending on your use case
      cascade: true,
      // This will automatically load the metaOptions when the Post is loaded
      // when requesting the Post entity cuz without it only the post alone will be loaded
      eager: true,
    })
  // This is the side of the relation that will create a foreign key in the Post table.
  // Basically it tells TypeORM that this Post entity will have a foreign key
  // @JoinColumn()

  // we need to move the foreign key to the MetaOption entity
  // so when we delete a post the meta options will be deleted as well
  // and not the other way around so the meta option must hold 
  // the foreign key to the post

  // IF WE REMOVED THE PRIMARY KEY
  // THE FOREIGN KEY WILL BE REMOVED AS WELL
  //PRIMARY KEY
  metaOptions?: MetaOption;
}
