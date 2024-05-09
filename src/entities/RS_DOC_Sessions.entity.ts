import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import RS_CTL_Users from './RS_CTL_Users.entity';

@Entity('RS_DOC_Sessions')
export class RS_DOC_Sessions {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  rs_id: number;

  @ApiProperty({ example: '2000-00-00T00:00:00.000Z' })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  rs_date: string;

  @ApiProperty({ example: '111.111.111.111' })
  @Column({ default: '' })
  rs_ip: string;

  @ApiProperty({ example: 'Firefox Browser' })
  @Column({ default: '' })
  rs_agent: string;

  @Column({ length: 64, default: '' })
  rs_accessHash: string;

  @Column({ length: 64, default: '' })
  rs_refreshHash: string;

  @ManyToOne(() => RS_CTL_Users, (e: RS_CTL_Users) => e.rs_id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'rs_userId' })
  @Column()
  rs_userId: number;
}
