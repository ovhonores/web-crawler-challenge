import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { FilterStatus } from '../../../usage-logs/dto/create-usage-log.dto';

@Entity('usage_logs')
export class UsageLogEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  filter: string;

  @Column('int')
  entriesReturned: number;

  @Column('int', { nullable: true })
  executionMs: number;

  @Column({ nullable: true })
  userAgent: string;

  @Column({ nullable: true })
  ip: string;

  @Column({ nullable: true })
  status: FilterStatus;

  @Column({ nullable: true })
  errorMessage: string;

  @CreateDateColumn()
  timestamp: Date;
}
