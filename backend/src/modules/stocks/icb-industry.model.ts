import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('icb_industries')
export class IcbIndustry {
  @PrimaryColumn({ name: 'code' })
  code: string;

  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'en_name', nullable: true })
  enName: string;

  @Column({ name: 'level', type: 'int' })
  level: number;
}
