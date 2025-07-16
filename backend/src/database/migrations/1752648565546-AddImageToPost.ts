import { MigrationInterface, QueryRunner } from "typeorm";

export class AddImageToPost1752648565546 implements MigrationInterface {
    name = 'AddImageToPost1752648565546'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" ADD "image" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" DROP COLUMN "image"`);
    }

}
