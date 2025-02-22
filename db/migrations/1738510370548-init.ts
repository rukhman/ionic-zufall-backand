import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1738510370548 implements MigrationInterface {
  name = 'Init1738510370548';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "permissions" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" text, CONSTRAINT "PK_920331560282b8bd21bb02290df" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "roles" ("id" SERIAL NOT NULL, "name" character varying(200) NOT NULL, "description" text, CONSTRAINT "UQ_648e3f5447f725579d7d4ffdfb7" UNIQUE ("name"), CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "products" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" text, "city" character varying NOT NULL, "price" character varying NOT NULL, "sale" character varying, "sale_type" character varying, "create_date" TIMESTAMP, "update_date" TIMESTAMP, "photos" text NOT NULL, CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE TYPE "public"."users_gender_enum" AS ENUM('male', 'female')`);
    await queryRunner.query(`CREATE TYPE "public"."users_auth_service_enum" AS ENUM('google', 'yandex')`);
    await queryRunner.query(
      `CREATE TABLE "users" ("id" SERIAL NOT NULL, "auth_id" character varying NOT NULL, "first_name" character varying, "second_name" character varying, "full_name" character varying, "email2" character varying NOT NULL, "avatar_id" character varying, "phone" character varying, "birth_date" TIMESTAMP, "gender" "public"."users_gender_enum" NOT NULL, "auth_service" "public"."users_auth_service_enum", CONSTRAINT "UQ_32ddc1ae708e8261a870a6eb3e6" UNIQUE ("auth_id"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "events" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" text, "city" character varying NOT NULL, "create_date" TIMESTAMP, "update_date" TIMESTAMP, "photos" text NOT NULL, CONSTRAINT "PK_40731c7151fe4be3116e45ddf73" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "roles-permissions" ("roleId" integer NOT NULL, "permissionId" integer NOT NULL, CONSTRAINT "PK_60e14e722fa98bb64c1748b7474" PRIMARY KEY ("roleId", "permissionId"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_7b38f2a9c5cdb8832c4c9680d4" ON "roles-permissions" ("roleId") `);
    await queryRunner.query(`CREATE INDEX "IDX_889ad75d3b742bc57893e4c45f" ON "roles-permissions" ("permissionId") `);
    await queryRunner.query(
      `CREATE TABLE "users-events" ("userAuthId" character varying NOT NULL, "eventId" integer NOT NULL, CONSTRAINT "PK_1d16a088c6bd7303f0f8df00891" PRIMARY KEY ("userAuthId", "eventId"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_04539b189a8078439d8566cedc" ON "users-events" ("userAuthId") `);
    await queryRunner.query(`CREATE INDEX "IDX_71b5963047b3965067a6657ef3" ON "users-events" ("eventId") `);
    await queryRunner.query(
      `CREATE TABLE "products-events" ("userAuthId" character varying NOT NULL, "productId" integer NOT NULL, CONSTRAINT "PK_0f01dfee0a141e2c66da45cf772" PRIMARY KEY ("userAuthId", "productId"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_c6efd3c3d470c4d0d4547b5c55" ON "products-events" ("userAuthId") `);
    await queryRunner.query(`CREATE INDEX "IDX_301d924a4308fd55a16ec54f8b" ON "products-events" ("productId") `);
    await queryRunner.query(
      `CREATE TABLE "users-roles" ("userAuthId" character varying NOT NULL, "roleId" integer NOT NULL, CONSTRAINT "PK_25feeb91dca9933e2d630ac73c5" PRIMARY KEY ("userAuthId", "roleId"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_2812244c69b7bbd952d2fd82f6" ON "users-roles" ("userAuthId") `);
    await queryRunner.query(`CREATE INDEX "IDX_20a60c6d2c411efd64c03f1c18" ON "users-roles" ("roleId") `);
    await queryRunner.query(
      `ALTER TABLE "roles-permissions" ADD CONSTRAINT "FK_7b38f2a9c5cdb8832c4c9680d41" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "roles-permissions" ADD CONSTRAINT "FK_889ad75d3b742bc57893e4c45fe" FOREIGN KEY ("permissionId") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "users-events" ADD CONSTRAINT "FK_04539b189a8078439d8566cedc8" FOREIGN KEY ("userAuthId") REFERENCES "users"("auth_id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "users-events" ADD CONSTRAINT "FK_71b5963047b3965067a6657ef38" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "products-events" ADD CONSTRAINT "FK_c6efd3c3d470c4d0d4547b5c552" FOREIGN KEY ("userAuthId") REFERENCES "users"("auth_id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "products-events" ADD CONSTRAINT "FK_301d924a4308fd55a16ec54f8b0" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "users-roles" ADD CONSTRAINT "FK_2812244c69b7bbd952d2fd82f62" FOREIGN KEY ("userAuthId") REFERENCES "users"("auth_id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "users-roles" ADD CONSTRAINT "FK_20a60c6d2c411efd64c03f1c18f" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users-roles" DROP CONSTRAINT "FK_20a60c6d2c411efd64c03f1c18f"`);
    await queryRunner.query(`ALTER TABLE "users-roles" DROP CONSTRAINT "FK_2812244c69b7bbd952d2fd82f62"`);
    await queryRunner.query(`ALTER TABLE "products-events" DROP CONSTRAINT "FK_301d924a4308fd55a16ec54f8b0"`);
    await queryRunner.query(`ALTER TABLE "products-events" DROP CONSTRAINT "FK_c6efd3c3d470c4d0d4547b5c552"`);
    await queryRunner.query(`ALTER TABLE "users-events" DROP CONSTRAINT "FK_71b5963047b3965067a6657ef38"`);
    await queryRunner.query(`ALTER TABLE "users-events" DROP CONSTRAINT "FK_04539b189a8078439d8566cedc8"`);
    await queryRunner.query(`ALTER TABLE "roles-permissions" DROP CONSTRAINT "FK_889ad75d3b742bc57893e4c45fe"`);
    await queryRunner.query(`ALTER TABLE "roles-permissions" DROP CONSTRAINT "FK_7b38f2a9c5cdb8832c4c9680d41"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_20a60c6d2c411efd64c03f1c18"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_2812244c69b7bbd952d2fd82f6"`);
    await queryRunner.query(`DROP TABLE "users-roles"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_301d924a4308fd55a16ec54f8b"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_c6efd3c3d470c4d0d4547b5c55"`);
    await queryRunner.query(`DROP TABLE "products-events"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_71b5963047b3965067a6657ef3"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_04539b189a8078439d8566cedc"`);
    await queryRunner.query(`DROP TABLE "users-events"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_889ad75d3b742bc57893e4c45f"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_7b38f2a9c5cdb8832c4c9680d4"`);
    await queryRunner.query(`DROP TABLE "roles-permissions"`);
    await queryRunner.query(`DROP TABLE "events"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TYPE "public"."users_auth_service_enum"`);
    await queryRunner.query(`DROP TYPE "public"."users_gender_enum"`);
    await queryRunner.query(`DROP TABLE "products"`);
    await queryRunner.query(`DROP TABLE "roles"`);
    await queryRunner.query(`DROP TABLE "permissions"`);
  }
}
