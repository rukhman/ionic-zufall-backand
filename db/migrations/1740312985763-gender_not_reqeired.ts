import { MigrationInterface, QueryRunner } from "typeorm";

export class GenderNotReqeired1740312985763 implements MigrationInterface {
    name = 'GenderNotReqeired1740312985763'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "gender" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "gender" SET NOT NULL`);
    }

}
