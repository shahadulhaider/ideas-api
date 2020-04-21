import { Body, Controller, Get, Post, UsePipes } from '@nestjs/common';
import { CustomValidationPipe } from '../shared/custom-validation.pipe';
import { UserDTO } from './user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  getAllUsers() {
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
