import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1784216603860 implements MigrationInterface {
    name = 'Migration1784216603860'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "activities" ADD "objective_indicator_id" integer`);
        await queryRunner.query(`ALTER TABLE "activities" ADD "result_indicator_id" integer`);
        await queryRunner.query(`ALTER TABLE "activities" ADD CONSTRAINT "FK_fcd8ddf3d8cc1270507f642545e" FOREIGN KEY ("objective_indicator_id") REFERENCES "indicators"("id") ON DELETE SET NULL ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "activities" ADD CONSTRAINT "FK_e3abb6be74755c7f4413d78e8cc" FOREIGN KEY ("result_indicator_id") REFERENCES "indicators"("id") ON DELETE SET NULL ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "activities" DROP CONSTRAINT "FK_e3abb6be74755c7f4413d78e8cc"`);
        await queryRunner.query(`ALTER TABLE "activities" DROP CONSTRAINT "FK_fcd8ddf3d8cc1270507f642545e"`);
        await queryRunner.query(`ALTER TABLE "activities" DROP COLUMN "result_indicator_id"`);
        await queryRunner.query(`ALTER TABLE "activities" DROP COLUMN "objective_indicator_id"`);
    }

}
