import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './post.entity';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { User } from '../users/user.entity';
import { UsersModule } from '../users/users.module';
import { UploadModule } from '../common/upload/upload.module';

@Module({
  imports: [UploadModule, TypeOrmModule.forFeature([Post, User]), UsersModule],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}
