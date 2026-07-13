import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1783861834448 implements MigrationInterface {
    name = 'Migration1783861834448'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "indicators" RENAME COLUMN "goal" TO "targetValue"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "indicators" RENAME COLUMN "targetValue" TO "goal"`);
    }

}
