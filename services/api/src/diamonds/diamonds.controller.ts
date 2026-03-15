import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Query,
  Body,
  UseGuards,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { DiamondsService } from './diamonds.service';
import { SearchDiamondsDto } from './dto/search-diamonds.dto';
import { Public } from '../auth/decorators/public.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser, JwtPayload } from '../auth/decorators/current-user.decorator';

@ApiTags('Diamonds')
@Controller('diamonds')
export class DiamondsController {
  constructor(private readonly diamondsService: DiamondsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Search and filter diamonds' })
  @ApiResponse({ status: 200, description: 'Returns paginated diamond results with aggregations' })
  search(@Query() dto: SearchDiamondsDto) {
    return this.diamondsService.search(dto);
  }

  @Public()
  @Get('featured')
  @ApiOperation({ summary: 'Get featured diamonds for homepage' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  getFeatured(@Query('limit') limit?: number) {
    return this.diamondsService.getFeatured(limit ? Number(limit) : 6);
  }

  @Public()
  @Get('compare')
  @ApiOperation({ summary: 'Compare up to 4 diamonds side-by-side' })
  @ApiQuery({ name: 'ids', description: 'Comma-separated diamond IDs', required: true })
  compare(@Query('ids') ids: string) {
    const idArray = ids
      .split(',')
      .map((id) => id.trim())
      .filter(Boolean);
    return this.diamondsService.compareDiamonds(idArray);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get diamond details by ID' })
  @ApiResponse({ status: 200, description: 'Diamond details' })
  @ApiResponse({ status: 404, description: 'Diamond not found' })
  findOne(@Param('id') id: string) {
    return this.diamondsService.findById(id);
  }

  @Public()
  @Get(':id/related')
  @ApiOperation({ summary: 'Get related diamonds' })
  getRelated(@Param('id') id: string) {
    return this.diamondsService.getRelated(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/reserve')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reserve a diamond during checkout (30 min hold)' })
  reserve(@Param('id') id: string, @CurrentUser() user: JwtPayload) {
    return this.diamondsService.reserveDiamond(id, user.sub);
  }

  // Admin routes
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'STAFF')
  @Patch(':id/availability')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Toggle diamond availability (Admin)' })
  toggleAvailability(@Param('id') id: string, @Body('isAvailable') isAvailable: boolean) {
    return this.diamondsService.toggleAvailability(id, isAvailable);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post('admin/sync-elasticsearch')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Sync all diamonds to Elasticsearch (Admin)' })
  syncElasticsearch() {
    return this.diamondsService.syncAllToElasticsearch();
  }
}
