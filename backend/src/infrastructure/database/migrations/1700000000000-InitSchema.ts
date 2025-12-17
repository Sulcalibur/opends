import type { MigrationInterface, QueryRunner } from 'typeorm'

export class InitSchema1700000000000 implements MigrationInterface {
  name = 'InitSchema1700000000000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS design_files (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        name varchar(255) NOT NULL,
        source varchar(16) NOT NULL,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now()
      );
    `)

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS component_specs (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        name varchar(255) NOT NULL,
        variant varchar(255),
        properties jsonb NOT NULL DEFAULT '{}'::jsonb,
        design_file_id uuid NOT NULL REFERENCES design_files(id) ON DELETE CASCADE,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now()
      );
    `)
    await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS component_specs_unique
        ON component_specs (design_file_id, name, variant);
    `)

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS design_tokens (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        name varchar(255) NOT NULL,
        type varchar(32) NOT NULL,
        value jsonb NOT NULL,
        design_file_id uuid NOT NULL REFERENCES design_files(id) ON DELETE CASCADE,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now()
      );
    `)
    await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS design_tokens_unique
        ON design_tokens (design_file_id, name, type);
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS design_tokens_unique`)
    await queryRunner.query(`DROP TABLE IF EXISTS design_tokens`)
    await queryRunner.query(`DROP INDEX IF EXISTS component_specs_unique`)
    await queryRunner.query(`DROP TABLE IF EXISTS component_specs`)
    await queryRunner.query(`DROP TABLE IF EXISTS design_files`)
  }
}

