import { Controller, Get, Query, Req } from '@nestjs/common';
import type { Request } from 'express';
import { FiltersService } from './filters.service';
import { FilterQueryDto } from './dto/filter-query.dto';
import type { Entry } from '../crawler/interfaces/entry.interface';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('entries')
@Controller('entries')
export class FiltersController {
  constructor(private readonly filtersService: FiltersService) {}

  @ApiOperation({
    summary: 'Get filtered entries from Hacker News',
    description:
      'Fetches the top 30 entries from HN and applies the given filtering and sorting rules.',
  })
  @ApiOkResponse({
    description: 'List of filtered entries',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          number: { type: 'number', example: 1 },
          title: { type: 'string', example: 'Show HN: My project' },
          points: { type: 'number', example: 320 },
          comments: { type: 'number', example: 145 },
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid query parameters',
  })
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
