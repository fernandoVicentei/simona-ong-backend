import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveProjectStatusSuspended1785000000000 implements MigrationInterface {
    name = 'RemoveProjectStatusSuspended1785000000000';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "projects" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`
            ALTER TYPE "public"."projects_status_enum" RENAME TO "projects_status_enum_old";
            CREATE TYPE "public"."projects_status_enum" AS ENUM('DRAFT', 'ACTIVE', 'CLOSED');
            ALTER TABLE "projects" ALTER COLUMN "status" TYPE "public"."projects_status_enum" USING "status"::text::"public"."projects_status_enum";
            DROP TYPE "public"."projects_status_enum_old";
        `);
        await queryRunner.query(`ALTER TABLE "projects" ALTER COLUMN "status" SET DEFAULT 'DRAFT'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "projects" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`
            ALTER TYPE "public"."projects_status_enum" RENAME TO "projects_status_enum_old";
            CREATE TYPE "public"."projects_status_enum" AS ENUM('DRAFT', 'ACTIVE', 'SUSPENDED', 'CLOSED');
            ALTER TABLE "projects" ALTER COLUMN "status" TYPE "public"."projects_status_enum" USING "status"::text::"public"."projects_status_enum";
            DROP TYPE "public"."projects_status_enum_old";
        `);
        await queryRunner.query(`ALTER TABLE "projects" ALTER COLUMN "status" SET DEFAULT 'DRAFT'`);
    }
}
