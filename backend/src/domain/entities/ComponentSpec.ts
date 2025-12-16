import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  Index
} from 'typeorm'
import { DesignFile } from './DesignFile'

@Entity({ name: 'component_specs' })
@Index(['designFile', 'name', 'variant'], { unique: true })
export class ComponentSpec {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ type: 'varchar', length: 255 })
  name!: string

  @Column({ type: 'varchar', length: 255, nullable: true })
  variant?: string | null

  @Column({ type: 'jsonb', default: {} })
  properties!: Record<string, unknown>

  @ManyToOne(() => DesignFile, file => file.components, {
    onDelete: 'CASCADE'
  })
  designFile!: DesignFile

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date
}

