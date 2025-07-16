// import {
//   Entity,
//   PrimaryGeneratedColumn,
//   Column,
//   CreateDateColumn,
//   UpdateDateColumn,
//   ManyToOne,
// } from 'typeorm';
// import { User } from '../users/user.entity';

// @Entity('posts')
// export class Post {
//   @PrimaryGeneratedColumn('uuid')
//   id: string;

//   @Column()
//   title: string;

//   @Column()
//   content: string;

//   @CreateDateColumn()
//   createdAt: Date;

//   @UpdateDateColumn()
//   updatedAt: Date;

//   @ManyToOne(() => User, (user) => user.posts, {
//     onDelete: 'CASCADE',
//   })
//   user: User;
// }



// src/posts/post.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity('posts')
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column({ type: 'varchar', nullable: true }) // ✅ Explicitly define type
  image: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.posts, {
    onDelete: 'CASCADE',
  })
  user: User;
}

