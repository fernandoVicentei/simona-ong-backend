import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateOrganizationsTable1782939624067 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "organizations" ("id" SERIAL NOT NULL, "name" character varying(200) NOT NULL, "description" text, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_7c6203c9af3b9b0a0c8b5f1e2a3" UNIQUE ("name"), CONSTRAINT "PK_7c6203c9af3b9b0a0c8b5f1e2a4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "organization_users" ("id" SERIAL NOT NULL, "organization_id" integer, "user_id" integer, CONSTRAINT "PK_8dac5cf26ebd158416f477de800" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_users" ADD CONSTRAINT "FK_org_user_organization" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_users" ADD CONSTRAINT "FK_org_user_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "organization_users" DROP CONSTRAINT "FK_org_user_user"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_users" DROP CONSTRAINT "FK_org_user_organization"`,
    );
    await queryRunner.query(`DROP TABLE "organization_users"`);
    await queryRunner.query(`DROP TABLE "organizations"`);
  }
}
