import { Controller, Get, Query, Req } from '@nestjs/common';
import type { Request } from 'express';
import { FiltersService } from './filters.service';
import { FilterQueryDto } from './dto/filter-query.dto';
import type { Entry } from '../crawler/interfaces/entry.interface';

@Controller('entries')
export class FiltersController {
  constructor(private readonly filtersService: FiltersService) {}

  @Get()
  async findAll(
    @Req() req: Request,
    @Query() query: FilterQueryDto,
  ): Promise<Entry[]> {
    const ip =
      req.ip ||
      req.socket.remoteAddress ||
      req.headers['x-forwarded-for']?.toString() ||
      '';
    const userAgent = req.get('user-agent') || '';
    return this.filtersService.getFilteredEntries(query, { ip, userAgent });
  }
}
