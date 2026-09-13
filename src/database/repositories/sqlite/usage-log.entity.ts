import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

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

  @CreateDateColumn()
  timestamp: Date;
}
