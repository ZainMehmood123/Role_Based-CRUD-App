import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { BlockGuard } from '../auth/guards/block.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../auth/decorators/role.decorator';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { User } from 'src/users/user.entity';

@Controller('posts')
@UseGuards(JwtAuthGuard, BlockGuard)
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  // ✅ Create new post (user only)
 @Post()
@UseGuards(JwtAuthGuard, BlockGuard, RolesGuard)
@Role('user')
create(@Body() dto: CreatePostDto, @Req() req) {
  const user = { id: req.user.userId } as User;
  return this.postsService.createPost(dto, user);
}

  // ✅ Get my posts
  @Get('me')
  getMyPosts(@Req() req) {
    return this.postsService.getMyPosts(req.user.userId);
  }

  // ✅ Admin: Get posts by user ID
  @UseGuards(RolesGuard)
  @Role('admin')
  @Get('admin/user/:userId')
  getUserPosts(@Param('userId') userId: string) {
    return this.postsService.getPostsByUserId(userId);
  }


  // Update Post
@Patch(':id')
@UseGuards(JwtAuthGuard, BlockGuard, RolesGuard)
@Role('user')
update(
  @Param('id') id: string,
  @Body() dto: UpdatePostDto,
  @Req() req,
) {
  const user = {
    id: req.user.userId,
    role: req.user.role,
    isBlocked: req.user.isBlocked,
  } as User;

  return this.postsService.updatePost(id, dto, user);
}


  // ✅ Delete post (only own post or admin)
  @UseGuards(JwtAuthGuard, BlockGuard, RolesGuard)
@Role('user') // or omit this if both user/admin can delete
@Delete(':id')
delete(@Param('id') id: string, @Req() req) {
  const user = {
    id: req.user.userId, // or req.user.id if you fixed the JWT strategy
    role: req.user.role,
    isBlocked: req.user.isBlocked,
  } as User;

  return this.postsService.deletePost(id, user);
}
}
