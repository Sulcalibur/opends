import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, Index } from 'typeorm'
import { User } from './User'

export type Provider = 'figma' | 'penpot'

@Entity({ name: 'external_accounts' })
@Index(['user', 'provider'], { unique: true })
export class ExternalAccount {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @ManyToOne(() => User, user => user.externalAccounts, { onDelete: 'CASCADE' })
  user!: User

  @Column({ type: 'varchar', length: 32 })
  provider!: Provider

  @Column({ type: 'varchar', length: 255 })
  providerUserId!: string

  @Column({ type: 'varchar', length: 1024, nullable: true })
  scope!: string | null

  @Column({ type: 'jsonb', nullable: true })
  accessTokenEnc!: Record<string, unknown> | null

  @Column({ type: 'jsonb', nullable: true })
  refreshTokenEnc!: Record<string, unknown> | null

  @Column({ type: 'timestamptz', nullable: true })
  expiresAt!: Date | null

  @Column({ type: 'timestamptz', nullable: true })
  lastRefreshedAt!: Date | null

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date
}

