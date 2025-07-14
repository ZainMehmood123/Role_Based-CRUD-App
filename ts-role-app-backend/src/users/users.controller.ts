import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { BlockGuard } from '../auth/guards/block.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../auth/decorators/role.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // ✅ Admin: Get all users
  @UseGuards(JwtAuthGuard, BlockGuard, RolesGuard)
  @Role('admin')
  @Get('admin/all')
  findAllUsers() {
    return this.usersService.findAll();
  }

  // ✅ Admin: Block/unblock user
  @UseGuards(JwtAuthGuard, BlockGuard, RolesGuard)
  @Role('admin')
  @Patch(':id/block')
  async toggleBlock(@Param('id') id: string) {
    const user = await this.usersService.toggleBlock(id);
    return { message: `User is now ${user.isBlocked ? 'blocked' : 'unblocked'}` };
  }

  // ✅ Admin: Delete user + posts
  @UseGuards(JwtAuthGuard, BlockGuard, RolesGuard)
  @Role('admin')
  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }
}
