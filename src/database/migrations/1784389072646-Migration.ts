import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1784389072646 implements MigrationInterface {
    name = 'Migration1784389072646'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "indicator_year_targets" ADD "achieved_value" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "indicator_year_targets" DROP COLUMN "achieved_value"`);
    }

}
