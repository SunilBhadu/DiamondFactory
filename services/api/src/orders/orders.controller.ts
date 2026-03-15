import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  ParseIntPipe,
  DefaultValuePipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser, JwtPayload } from '../auth/decorators/current-user.decorator';

@ApiTags('Orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new order' })
  create(@CurrentUser() user: JwtPayload, @Body() dto: CreateOrderDto) {
    return this.ordersService.create(user.sub, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get current user orders' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  findAll(
    @CurrentUser() user: JwtPayload,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number
  ) {
    return this.ordersService.findAll(user.sub, page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get order details' })
  findOne(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.ordersService.findOne(id, user.sub);
  }

  @Post(':id/cancel')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cancel an order' })
  cancel(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.ordersService.cancel(id, user.sub);
  }

  // Admin routes
  @Get('admin/all')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'STAFF')
  @ApiOperation({ summary: 'List all orders (Admin)' })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'search', required: false })
  findAllAdmin(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('status') status?: string,
    @Query('search') search?: string
  ) {
    return this.ordersService.findAllAdmin(page, limit, status, search);
  }

  @Get('admin/stats')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Get order statistics (Admin)' })
  getStats() {
    return this.ordersService.getStats();
  }

  @Patch('admin/:id/status')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'STAFF')
  @ApiOperation({ summary: 'Update order status (Admin)' })
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: string,
    @Body('note') note?: string
  ) {
    return this.ordersService.updateStatus(id, status, note);
  }
}
