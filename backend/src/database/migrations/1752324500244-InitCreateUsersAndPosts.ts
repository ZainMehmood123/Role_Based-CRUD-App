import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitCreateUsersAndPosts1752324500244 implements MigrationInterface {
  name = 'InitCreateUsersAndPosts1752324500244';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create posts table
    await queryRunner.query(`
      CREATE TABLE "posts" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "title" character varying NOT NULL,
        "content" character varying NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "userId" uuid,
        CONSTRAINT "PK_2829ac61eff60fcec60d7274b9e" PRIMARY KEY ("id")
      )
    `);

    // Create users table
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "email" character varying NOT NULL,
        "password" character varying NOT NULL,
        "name" character varying NOT NULL,
        "role" character varying NOT NULL DEFAULT 'user',
        "isBlocked" boolean NOT NULL DEFAULT false,
        "lastSeen" TIMESTAMP,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"),
        CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
      )
    `);

    // Add foreign key with cascade delete
    await queryRunner.query(`
      ALTER TABLE "posts"
      ADD CONSTRAINT "FK_ae05faaa55c866130abef6e1fee"
      FOREIGN KEY ("userId") REFERENCES "users"("id")
      ON DELETE CASCADE ON UPDATE NO ACTION
    `);

    // Insert static admin
    await queryRunner.query(`
      INSERT INTO "users" (
        "id", "email", "password", "name", "role", "isBlocked", "createdAt"
      ) VALUES (
        '11111111-1111-1111-1111-111111111111',
        'admin@app.com',
        '$2b$10$q0ADPQoZzMdwAqN8MZ9rhOJqIj1iBl.l8jBlFP6vE8Y0FBSihz8QC', -- admin123
        'Admin',
        'admin',
        false,
        NOW()
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "posts" DROP CONSTRAINT "FK_ae05faaa55c866130abef6e1fee"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TABLE "posts"`);
  }
}
