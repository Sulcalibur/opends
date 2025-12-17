import type { MigrationInterface, QueryRunner } from 'typeorm'

export class AuthTables1700000000001 implements MigrationInterface {
  name = 'AuthTables1700000000001'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS users (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        email varchar(255) UNIQUE NOT NULL,
        display_name varchar(255) NOT NULL,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now()
      );
    `)
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS external_accounts (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id uuid REFERENCES users(id) ON DELETE CASCADE,
        provider varchar(32) NOT NULL,
        provider_user_id varchar(255) NOT NULL,
        scope varchar(1024),
        access_token_enc jsonb,
        refresh_token_enc jsonb,
        expires_at timestamptz,
        last_refreshed_at timestamptz,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now()
      );
    `)
    await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS external_accounts_unique
        ON external_accounts (user_id, provider);
    `)
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS oauth_states (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        state varchar(128) UNIQUE NOT NULL,
        code_verifier varchar(128) NOT NULL,
        provider varchar(64) NOT NULL,
        redirect_uri varchar(1024) NOT NULL,
        user_id uuid,
        created_at timestamptz NOT NULL DEFAULT now(),
        expires_at timestamptz NOT NULL
      );
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS oauth_states`)
    await queryRunner.query(`DROP INDEX IF EXISTS external_accounts_unique`)
    await queryRunner.query(`DROP TABLE IF EXISTS external_accounts`)
    await queryRunner.query(`DROP TABLE IF EXISTS users`)
  }
}

