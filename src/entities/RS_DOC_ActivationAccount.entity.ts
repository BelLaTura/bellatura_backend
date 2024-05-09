import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import RS_CTL_Users from './RS_CTL_Users.entity';

@Entity('RS_DOC_ActivationAccount')
export class RS_DOC_ActivationAccount {
  @PrimaryGeneratedColumn()
  rs_id: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  rs_date: Date;

  @Column()
  rs_token: string;

  @ManyToOne(() => RS_CTL_Users, (e: RS_CTL_Users) => e.rs_id, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'rs_userId' })
  @Column()
  rs_userId: number;
}
