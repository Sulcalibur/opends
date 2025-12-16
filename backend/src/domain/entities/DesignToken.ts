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

export type TokenType =
  | 'color'
  | 'size'
  | 'spacing'
  | 'typography'
  | 'shadow'
  | 'radius'
  | 'other'

@Entity({ name: 'design_tokens' })
@Index(['designFile', 'name', 'type'], { unique: true })
export class DesignToken {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ type: 'varchar', length: 255 })
  name!: string

  @Column({ type: 'varchar', length: 32 })
  type!: TokenType

  @Column({ type: 'simple-json' })
  value!: unknown

  @ManyToOne(() => DesignFile, file => file.tokens, {
    onDelete: 'CASCADE'
  })
  designFile!: DesignFile

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date
}

