import {
  Controller,
  Get,
  Patch,
  Post,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { UsersService, UpdateProfileDto, CreateAddressDto } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser, JwtPayload } from '../auth/decorators/current-user.decorator';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  getMe(@CurrentUser() user: JwtPayload) {
    return this.usersService.findById(user.sub);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Update current user profile' })
  updateMe(@CurrentUser() user: JwtPayload, @Body() dto: UpdateProfileDto) {
    return this.usersService.updateProfile(user.sub, dto);
  }

  @Get('me/addresses')
  @ApiOperation({ summary: 'Get all saved addresses' })
  getAddresses(@CurrentUser() user: JwtPayload) {
    return this.usersService.getAddresses(user.sub);
  }

  @Post('me/addresses')
  @ApiOperation({ summary: 'Add a new address' })
  addAddress(@CurrentUser() user: JwtPayload, @Body() dto: CreateAddressDto) {
    return this.usersService.addAddress(user.sub, dto);
  }

  @Patch('me/addresses/:id')
  @ApiOperation({ summary: 'Update an address' })
  updateAddress(
    @CurrentUser() user: JwtPayload,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: Partial<CreateAddressDto>
  ) {
    return this.usersService.updateAddress(user.sub, id, dto);
  }

  @Delete('me/addresses/:id')
  @ApiOperation({ summary: 'Delete an address' })
  deleteAddress(@CurrentUser() user: JwtPayload, @Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.deleteAddress(user.sub, id);
  }

  // Admin routes
  @Get()
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'STAFF')
  @ApiOperation({ summary: 'List all users (Admin)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('search') search?: string
  ) {
    return this.usersService.findAll(page, limit, search);
  }

  @Patch(':id/active')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Activate or deactivate a user (Admin)' })
  setActive(@Param('id', ParseUUIDPipe) id: string, @Body('isActive') isActive: boolean) {
    return this.usersService.setActive(id, isActive);
  }
}
