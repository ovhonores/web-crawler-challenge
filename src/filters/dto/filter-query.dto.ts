import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';

export enum WordOperator {
  GT = 'gt', // >
  GTE = 'gte', // >=
  LT = 'lt', // <
  LTE = 'lte', // <=
  EQ = 'eq', // ==
}

export enum SortBy {
  POINTS = 'points',
  COMMENTS = 'comments',
  NUMBER = 'number',
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}
// Dinamic FilterQueryDto class to handle query parameters for filtering and sorting entries
export class FilterQueryDto {
  @ApiPropertyOptional({ example: 5, minimum: 0, default: 5 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  words?: number = 5;

  @ApiPropertyOptional({ enum: WordOperator, default: WordOperator.GT })
  @IsOptional()
  @IsEnum(WordOperator)
  operator?: WordOperator = WordOperator.GT;

  @ApiPropertyOptional({ enum: SortBy, default: SortBy.COMMENTS })
  @IsOptional()
  @IsEnum(SortBy)
  sortBy?: SortBy = SortBy.COMMENTS;

  @ApiPropertyOptional({ enum: SortOrder, default: SortOrder.DESC })
  @IsOptional()
  @IsEnum(SortOrder)
  order?: SortOrder = SortOrder.DESC;
}
