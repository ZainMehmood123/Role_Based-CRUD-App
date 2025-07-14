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

  // ✅ Create a post
  async createPost(dto: CreatePostDto, user: User): Promise<Post> {
    const post = this.postRepo.create({ ...dto, user });
    console.log('Creating post for user:', user);
    return this.postRepo.save(post);

  }

  // ✅ Get all posts by current user
async getMyPosts(userId: string): Promise<Post[]> {
  return this.postRepo.find({
    where: { user: { id: userId } },
    relations: ['user'], // 👈 This line is required
    order: { createdAt: 'DESC' },
  });
}

  // ✅ Admin: Get posts of specific user
  async getPostsByUserId(userId: string): Promise<Post[]> {
    return this.postRepo.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });
  }

  // ✅ Update post (user can only update their own post)
  async updatePost(id: string, dto: UpdatePostDto, user: User): Promise<Post> {
    const post = await this.postRepo.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!post) throw new NotFoundException('Post not found');
    console.log('User attempting update:', user.id);
console.log('Post belongs to user:', post.user.id);
    if (post.user.id !== user.id && user.role !== 'admin') {
      throw new ForbiddenException('Access denied');
    }

    Object.assign(post, dto);
    return this.postRepo.save(post);
  }

  // ✅ Delete post (user or admin)
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
