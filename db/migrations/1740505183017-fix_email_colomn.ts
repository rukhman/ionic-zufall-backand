import { MigrationInterface, QueryRunner } from "typeorm";

export class FixEmailColomn1740505183017 implements MigrationInterface {
    name = 'FixEmailColomn1740505183017'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "email2" TO "email"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "email" TO "email2"`);
    }

}
