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
import { UploadService } from 'src/common/upload/upload.service';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postRepo: Repository<Post>,
    private readonly uploadService: UploadService,
  ) {}

  async createPost(dto: CreatePostDto, user: User): Promise<Post> {
    const post = this.postRepo.create({
      title: dto.title,
      content: dto.content,
      image: dto.image ?? null,
      user,
    });

    const savedPost = await this.postRepo.save(post);
    savedPost.image = this.uploadService.buildImageUrl(savedPost.image);
    return savedPost;
  }

  async getMyPosts(userId: string): Promise<Post[]> {
    const posts = await this.postRepo.find({
      where: { user: { id: userId } },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });

    return posts.map((post) => ({
      ...post,
      image: this.uploadService.buildImageUrl(post.image),
    }));
  }

  async getPostsByUserId(userId: string): Promise<Post[]> {
    const posts = await this.postRepo.find({
      where: { user: { id: userId } },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });

    return posts.map((post) => ({
      ...post,
      image: this.uploadService.buildImageUrl(post.image),
    }));
  }

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
    updatedPost.image = this.uploadService.buildImageUrl(updatedPost.image);
    return updatedPost;
  }

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
