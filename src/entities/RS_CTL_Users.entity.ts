import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('RS_CTL_Users')
export default class RS_CTL_Users {
  @PrimaryGeneratedColumn()
  rs_id: number;

  @Column({ default: 0 })
  rs_ref: number;

  @Index('UNI_RsCtlUsers_email', { unique: true })
  @Column({ length: 64, default: '' })
  rs_email: string;

  @Index('UNI_RsCtlUsers_login', { unique: true })
  @Column({ length: 64, default: '' })
  rs_login: string;

  @Column({ length: 32, default: '' })
  rs_surname: string;

  @Column({ length: 32, default: '' })
  rs_name: string;

  @Column({ length: 32, default: '' })
  rs_middlename: string;

  @Column({ length: 255, default: '' })
  rs_passwordHash: string;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  rs_birthday: string;

  @Column({ length: 13, default: '' })
  rs_phone: string;

  @Column({ length: 255, default: '' })
  rs_address: string;

  @Column({ length: 64, default: '' })
  rs_telegramNickname: string;

  @Column({ length: 13, default: '' })
  rs_viberPhone: string;

  @Column({ length: 13, default: '' })
  rs_whatsappPhone: string;

  @Column({ default: 0 })
  rs_isActivated: boolean;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  rs_createdAt: string;
}
