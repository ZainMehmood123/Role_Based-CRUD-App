// import {
//   Injectable,
//   NotFoundException,
//   ForbiddenException,
// } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Post } from './post.entity';
// import { Repository } from 'typeorm';
// import { CreatePostDto } from './dto/create-post.dto';
// import { UpdatePostDto } from './dto/update-post.dto';
// import { User } from '../users/user.entity';

// @Injectable()
// export class PostsService {
//   constructor(
//     @InjectRepository(Post)
//     private postRepo: Repository<Post>,
//   ) {}

//   // ✅ Create a post
//   async createPost(dto: CreatePostDto, user: User): Promise<Post> {
//     const post = this.postRepo.create({ ...dto, user });
//     console.log('Creating post for user:', user);
//     return this.postRepo.save(post);

//   }

//   // ✅ Get all posts by current user
// async getMyPosts(userId: string): Promise<Post[]> {
//   return this.postRepo.find({
//     where: { user: { id: userId } },
//     relations: ['user'], // 👈 This line is required
//     order: { createdAt: 'DESC' },
//   });
// }

//   // ✅ Admin: Get posts of specific user
//   async getPostsByUserId(userId: string): Promise<Post[]> {
//     return this.postRepo.find({
//       where: { user: { id: userId } },
//       order: { createdAt: 'DESC' },
//     });
//   }

//   // ✅ Update post (user can only update their own post)
//   async updatePost(id: string, dto: UpdatePostDto, user: User): Promise<Post> {
//     const post = await this.postRepo.findOne({
//       where: { id },
//       relations: ['user'],
//     });

//     if (!post) throw new NotFoundException('Post not found');
//     console.log('User attempting update:', user.id);
// console.log('Post belongs to user:', post.user.id);
//     if (post.user.id !== user.id && user.role !== 'admin') {
//       throw new ForbiddenException('Access denied');
//     }

//     Object.assign(post, dto);
//     return this.postRepo.save(post);
//   }

//   // ✅ Delete post (user or admin)
//   async deletePost(id: string, user: User): Promise<{ message: string }> {
//     const post = await this.postRepo.findOne({
//       where: { id },
//       relations: ['user'],
//     });

//     if (!post) throw new NotFoundException('Post not found');
//     if (post.user.id !== user.id && user.role !== 'admin') {
//       throw new ForbiddenException('Access denied');
//     }

//     await this.postRepo.remove(post);
//     return { message: 'Post deleted successfully' };
//   }
// }



// import {
//   Injectable,
//   NotFoundException,
//   ForbiddenException,
// } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Post } from './post.entity';
// import { Repository } from 'typeorm';
// import { CreatePostDto } from './dto/create-post.dto';
// import { UpdatePostDto } from './dto/update-post.dto';
// import { User } from '../users/user.entity';

// @Injectable()
// export class PostsService {
//   constructor(
//     @InjectRepository(Post)
//     private postRepo: Repository<Post>,
//   ) {}

//   async createPost(dto: CreatePostDto, user: User): Promise<Post> {
//   const post = this.postRepo.create({
//     title: dto.title,
//     content: dto.content,
//     image: dto.image, // ✅ Add image path if present
//     user,
//   });

//   return this.postRepo.save(post);
// }


//   // ✅ Get all posts by current user
// async getMyPosts(userId: string): Promise<Post[]> {
//   return this.postRepo.find({
//     where: { user: { id: userId } },
//     relations: ['user'], // 👈 This line is required
//     order: { createdAt: 'DESC' },
//   });
// }

//   // ✅ Admin: Get posts of specific user
//   async getPostsByUserId(userId: string): Promise<Post[]> {
//     return this.postRepo.find({
//       where: { user: { id: userId } },
//       order: { createdAt: 'DESC' },
//     });
//   }

//   // ✅ Update post (user can only update their own post)
//   async updatePost(id: string, dto: UpdatePostDto, user: User): Promise<Post> {
//     const post = await this.postRepo.findOne({
//       where: { id },
//       relations: ['user'],
//     });

//     if (!post) throw new NotFoundException('Post not found');
//     console.log('User attempting update:', user.id);
// console.log('Post belongs to user:', post.user.id);
//     if (post.user.id !== user.id && user.role !== 'admin') {
//       throw new ForbiddenException('Access denied');
//     }

//     Object.assign(post, dto);
//     return this.postRepo.save(post);
//   }

//   // ✅ Delete post (user or admin)
//   async deletePost(id: string, user: User): Promise<{ message: string }> {
//     const post = await this.postRepo.findOne({
//       where: { id },
//       relations: ['user'],
//     });

//     if (!post) throw new NotFoundException('Post not found');
//     if (post.user.id !== user.id && user.role !== 'admin') {
//       throw new ForbiddenException('Access denied');
//     }

//     await this.postRepo.remove(post);
//     return { message: 'Post deleted successfully' };
//   }
// }



import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { User } from '../users/user.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postRepo: Repository<Post>,
  ) {}

  private buildImageUrl(image: string | null | undefined): string | null {
    if (!image) return null;
    return `http://localhost:5000/${image}`;
  }

  // ✅ Create post with image support
  async createPost(dto: CreatePostDto, user: User): Promise<Post> {
    const post = this.postRepo.create({
      title: dto.title,
      content: dto.content,
      image: dto.image ?? null,
      user,
    });

    const savedPost = await this.postRepo.save(post);
    savedPost.image = this.buildImageUrl(savedPost.image);
    return savedPost;
  }

  // ✅ Get all posts by current user (with image URL)
  async getMyPosts(userId: string): Promise<Post[]> {
    const posts = await this.postRepo.find({
      where: { user: { id: userId } },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });

    return posts.map((post) => ({
      ...post,
      image: this.buildImageUrl(post.image),
    }));
  }

  // ✅ Admin: Get posts by specific user
  async getPostsByUserId(userId: string): Promise<Post[]> {
    const posts = await this.postRepo.find({
      where: { user: { id: userId } },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });

    return posts.map((post) => ({
      ...post,
      image: this.buildImageUrl(post.image),
    }));
  }

  // ✅ Update post (title, content, image)
  async updatePost(id: string, dto: UpdatePostDto, user: User): Promise<Post> {
    const post = await this.postRepo.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!post) throw new NotFoundException('Post not found');
    if (post.user.id !== user.id && user.role !== 'admin') {
      throw new ForbiddenException('Access denied');
    }

    Object.assign(post, dto);

    const updatedPost = await this.postRepo.save(post);
    updatedPost.image = this.buildImageUrl(updatedPost.image);
    return updatedPost;
  }

  // ✅ Delete post
  async deletePost(id: string, user: User): Promise<{ message: string }> {
    const post = await this.postRepo.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!post) throw new NotFoundException('Post not found');
    if (post.user.id !== user.id && user.role !== 'admin') {
      throw new ForbiddenException('Access denied');
    }

    await this.postRepo.remove(post);
    return { message: 'Post deleted successfully' };
  }
}
