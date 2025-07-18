import {
  Controller,
  Post as HttpPost,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { BlockGuard } from '../auth/guards/block.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../auth/decorators/role.decorator';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { User } from 'src/users/user.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from 'src/common/upload/upload.service';

@Controller('posts')
@UseGuards(JwtAuthGuard, BlockGuard)
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly uploadService: UploadService,
  ) {}

  @HttpPost()
  @UseGuards(JwtAuthGuard, BlockGuard, RolesGuard)
  @Role('user')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: new UploadService().getStorage('posts'),
    }),
  )
  create(
    @Body() dto: CreatePostDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req,
  ) {
    const user = { id: req.user.userId } as User;
    const image = file
      ? this.uploadService.getRelativePath(file.filename, 'posts')
      : null;

    return this.postsService.createPost({ ...dto, image }, user);
  }

  @Get('me')
  getMyPosts(@Req() req) {
    return this.postsService.getMyPosts(req.user.userId);
  }

  @UseGuards(RolesGuard)
  @Role('admin')
  @Get('admin/user/:userId')
  getUserPosts(@Param('userId') userId: string) {
    return this.postsService.getPostsByUserId(userId);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, BlockGuard, RolesGuard)
  @Role('user')
  update(@Param('id') id: string, @Body() dto: UpdatePostDto, @Req() req) {
    const user = {
      id: req.user.userId,
      role: req.user.role,
      isBlocked: req.user.isBlocked,
    } as User;

    return this.postsService.updatePost(id, dto, user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, BlockGuard, RolesGuard)
  @Role('user')
  delete(@Param('id') id: string, @Req() req) {
    const user = {
      id: req.user.userId,
      role: req.user.role,
      isBlocked: req.user.isBlocked,
    } as User;

    return this.postsService.deletePost(id, user);
  }
}
