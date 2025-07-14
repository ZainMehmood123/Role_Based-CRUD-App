import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePostsTable1752326965630 implements MigrationInterface {
    name = 'CreatePostsTable1752326965630'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "updatedAt"`);
    }

}
