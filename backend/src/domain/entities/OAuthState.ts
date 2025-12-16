import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm'

@Entity({ name: 'oauth_states' })
export class OAuthState {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 128 })
  state!: string

  @Column({ type: 'varchar', length: 128 })
  codeVerifier!: string

  @Column({ type: 'varchar', length: 64 })
  provider!: 'figma' | 'penpot'

  @Column({ type: 'varchar', length: 1024 })
  redirectUri!: string

  @Column({ type: 'uuid', nullable: true })
  userId!: string | null

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date

  @Column({ type: 'timestamptz' })
  expiresAt!: Date
}

