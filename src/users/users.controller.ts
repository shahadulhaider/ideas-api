import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { AuthGuard } from 'src/shared/auth.guard';
import { User } from 'src/shared/user.decorator';
import { CustomValidationPipe } from '../shared/custom-validation.pipe';
import { UserDTO } from './user.dto';
import { UsersService } from './users.service';

@Controller()
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('users')
  getAllUsers(@Query('page') page: number) {
    return this.usersService.getAllUsers(page);
  }

  @Get('uers/:username')
  getOneUser(@Param('username') username: string) {
    return this.usersService.read(username);
  }

  @Get('auth/whoami')
  @UseGuards(AuthGuard)
  showMe(@User('username') username: string) {
    return this.usersService.read(username);
  }

  @Post('auth/login')
  @UsePipes(CustomValidationPipe)
  login(@Body() data: UserDTO) {
    return this.usersService.login(data);
  }

  @Post('auth/register')
  @UsePipes(CustomValidationPipe)
  register(@Body() data: UserDTO) {
    return this.usersService.register(data);
  }
}
