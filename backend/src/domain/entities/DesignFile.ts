import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm'
import { ComponentSpec } from './ComponentSpec'
import { DesignToken } from './DesignToken'

export type DesignSource = 'penpot' | 'figma'

@Entity({ name: 'design_files' })
export class DesignFile {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ type: 'varchar', length: 255 })
  name!: string

  @Column({ type: 'varchar', length: 16 })
  source!: DesignSource

  @Column({ type: 'varchar', length: 2048, nullable: true })
  url?: string

  @Column({ type: 'varchar', length: 255, nullable: true, name: 'external_id' })
  externalId?: string

  @Column({ type: 'text', nullable: true, name: 'api_token' })
  apiToken?: string

  @Column({ type: 'timestamp', nullable: true, name: 'synced_at' })
  syncedAt?: Date

  @OneToMany(() => ComponentSpec, spec => spec.designFile, { cascade: true })
  components!: ComponentSpec[]

  @OneToMany(() => DesignToken, token => token.designFile, { cascade: true })
  tokens!: DesignToken[]

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date
}

