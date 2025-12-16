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

  @OneToMany(() => ComponentSpec, spec => spec.designFile, { cascade: true })
  components!: ComponentSpec[]

  @OneToMany(() => DesignToken, token => token.designFile, { cascade: true })
  tokens!: DesignToken[]

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date
}

