import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { AuthGuard } from '../shared/auth.guard';
import { CustomValidationPipe } from '../shared/custom-validation.pipe';
import { UserDTO } from './user.dto';
import { UsersService } from './users.service';
import { User } from '../shared/user.decorator';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @UseGuards(AuthGuard)
  getAllUsers(@User() user: object) {
    console.log(user);
    return this.usersService.getAllUsers();
  }

  @Post('login')
  @UsePipes(CustomValidationPipe)
  login(@Body() data: UserDTO) {
    return this.usersService.login(data);
  }

  @Post('register')
  @UsePipes(CustomValidationPipe)
  register(@Body() data: UserDTO) {
    return this.usersService.register(data);
  }
}
