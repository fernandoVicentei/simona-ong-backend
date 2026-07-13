import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1783625371905 implements MigrationInterface {
  name = 'Migration1783625371905';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "organization_users" DROP CONSTRAINT "FK_org_user_organization"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_users" DROP CONSTRAINT "FK_org_user_user"`,
    );
    await queryRunner.query(
      `CREATE TABLE "activities" ("id" SERIAL NOT NULL, "result_id" integer NOT NULL, "code" character varying(30) NOT NULL, "name" character varying(250) NOT NULL, "description" text, "completion_percentage" numeric(5,2) NOT NULL DEFAULT '0', "start_date" date, "end_date" date, "active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_7f4004429f731ffb9c88eb486a8" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "UQ_ACTIVITY_CODE_PER_RESULT" ON "activities" ("result_id", "code") `,
    );
    await queryRunner.query(
      `CREATE TABLE "strategic_plans" ("id" SERIAL NOT NULL, "organization_id" integer NOT NULL, "code" character varying(30) NOT NULL, "name" character varying(200) NOT NULL, "description" text, "start_year" smallint NOT NULL, "end_year" smallint NOT NULL, "active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "UQ_2e6e4d03c636b3514ca63b90cec" UNIQUE ("code"), CONSTRAINT "PK_999d2cd00158a533ebfb6abd2db" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "UQ_STRATEGIC_PLAN_PERIOD" ON "strategic_plans" ("organization_id", "start_year", "end_year") `,
    );
    await queryRunner.query(
      `CREATE TABLE "programs" ("id" SERIAL NOT NULL, "strategic_plan_id" integer NOT NULL, "code" character varying(30) NOT NULL, "name" character varying(200) NOT NULL, "general_objective" text NOT NULL, "description" text, "active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_d43c664bcaafc0e8a06dfd34e05" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "UQ_PROGRAM_CODE_PER_PLAN" ON "programs" ("strategic_plan_id", "code") `,
    );
    await queryRunner.query(
      `CREATE TABLE "objectives" ("id" SERIAL NOT NULL, "program_id" integer NOT NULL, "code" character varying(30) NOT NULL, "name" character varying(250) NOT NULL, "description" text, "completion_percentage" numeric(5,2) NOT NULL DEFAULT '0', "active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_c54846771e6a2db24c2b886eca0" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "UQ_OBJECTIVE_CODE_PER_PROGRAM" ON "objectives" ("program_id", "code") `,
    );
    await queryRunner.query(
      `CREATE TABLE "results" ("id" SERIAL NOT NULL, "objective_id" integer NOT NULL, "code" character varying(30) NOT NULL, "name" character varying(250) NOT NULL, "description" text, "completion_percentage" numeric(5,2) NOT NULL DEFAULT '0', "active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_e8f2a9191c61c15b627c117a678" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "UQ_RESULT_CODE_PER_OBJECTIVE" ON "results" ("objective_id", "code") `,
    );
    await queryRunner.query(
      `CREATE TABLE "indicator_year_targets" ("id" SERIAL NOT NULL, "indicator_id" integer NOT NULL, "year" smallint NOT NULL, "target_value" numeric(15,2) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_INDICATOR_YEAR" UNIQUE ("indicator_id", "year"), CONSTRAINT "PK_3f4579069a9a1742b4867fe01f6" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "indicator_progress" ("id" SERIAL NOT NULL, "indicator_id" integer NOT NULL, "progress_date" date NOT NULL, "current_value" numeric(15,2) NOT NULL, "observations" text, "registered_by" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_de60ef04ab4543316af67187b0f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_INDICATOR_PROGRESS" ON "indicator_progress" ("indicator_id", "progress_date") `,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."indicators_type_enum" AS ENUM('OBJECTIVE', 'RESULT', 'ACTIVITY')`,
    );
    await queryRunner.query(
      `CREATE TABLE "indicators" ("id" SERIAL NOT NULL, "objective_id" integer, "result_id" integer, "activity_id" integer, "code" character varying(30) NOT NULL, "name" character varying(250) NOT NULL, "description" text, "type" "public"."indicators_type_enum" NOT NULL, "goal" numeric(15,2) NOT NULL, "measurementUnit" character varying(100), "active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_6e24383c110600564187e92042e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "UQ_INDICATOR_CODE" ON "indicators" ("code") `,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_users" ADD CONSTRAINT "FK_095c5c2bd5c0e3d7e899e5b20e6" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_users" ADD CONSTRAINT "FK_850fda09e6a73f03b7949ddc06c" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "activities" ADD CONSTRAINT "FK_d3f945918a3c4c18bf9567f1566" FOREIGN KEY ("result_id") REFERENCES "results"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "strategic_plans" ADD CONSTRAINT "FK_e8a39c34818a1ab1654ec03551c" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "programs" ADD CONSTRAINT "FK_7e6997fbf57da1f67aebc34abf1" FOREIGN KEY ("strategic_plan_id") REFERENCES "strategic_plans"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "objectives" ADD CONSTRAINT "FK_b8743aeb5939ffaf4ede2f223ca" FOREIGN KEY ("program_id") REFERENCES "programs"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "results" ADD CONSTRAINT "FK_bca62b54e32dc90eb773dc86db4" FOREIGN KEY ("objective_id") REFERENCES "objectives"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "indicator_year_targets" ADD CONSTRAINT "FK_fc08a1a151f22ed9b2855a1ce23" FOREIGN KEY ("indicator_id") REFERENCES "indicators"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "indicator_progress" ADD CONSTRAINT "FK_41f18cff9cc042a89e74161324a" FOREIGN KEY ("indicator_id") REFERENCES "indicators"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "indicator_progress" ADD CONSTRAINT "FK_b38034d29e1ea75814a65180253" FOREIGN KEY ("registered_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "indicators" ADD CONSTRAINT "FK_b1c29db1159dda64045a448df11" FOREIGN KEY ("objective_id") REFERENCES "objectives"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "indicators" ADD CONSTRAINT "FK_b9553a57df237d5c9e73cb1145f" FOREIGN KEY ("result_id") REFERENCES "results"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "indicators" ADD CONSTRAINT "FK_67b3451c7142cae2cc2c6457644" FOREIGN KEY ("activity_id") REFERENCES "activities"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "indicators" DROP CONSTRAINT "FK_67b3451c7142cae2cc2c6457644"`,
    );
    await queryRunner.query(
      `ALTER TABLE "indicators" DROP CONSTRAINT "FK_b9553a57df237d5c9e73cb1145f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "indicators" DROP CONSTRAINT "FK_b1c29db1159dda64045a448df11"`,
    );
    await queryRunner.query(
      `ALTER TABLE "indicator_progress" DROP CONSTRAINT "FK_b38034d29e1ea75814a65180253"`,
    );
    await queryRunner.query(
      `ALTER TABLE "indicator_progress" DROP CONSTRAINT "FK_41f18cff9cc042a89e74161324a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "indicator_year_targets" DROP CONSTRAINT "FK_fc08a1a151f22ed9b2855a1ce23"`,
    );
    await queryRunner.query(
      `ALTER TABLE "results" DROP CONSTRAINT "FK_bca62b54e32dc90eb773dc86db4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "objectives" DROP CONSTRAINT "FK_b8743aeb5939ffaf4ede2f223ca"`,
    );
    await queryRunner.query(
      `ALTER TABLE "programs" DROP CONSTRAINT "FK_7e6997fbf57da1f67aebc34abf1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "strategic_plans" DROP CONSTRAINT "FK_e8a39c34818a1ab1654ec03551c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "activities" DROP CONSTRAINT "FK_d3f945918a3c4c18bf9567f1566"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_users" DROP CONSTRAINT "FK_850fda09e6a73f03b7949ddc06c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_users" DROP CONSTRAINT "FK_095c5c2bd5c0e3d7e899e5b20e6"`,
    );
    await queryRunner.query(`DROP INDEX "public"."UQ_INDICATOR_CODE"`);
    await queryRunner.query(`DROP TABLE "indicators"`);
    await queryRunner.query(`DROP TYPE "public"."indicators_type_enum"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_INDICATOR_PROGRESS"`);
    await queryRunner.query(`DROP TABLE "indicator_progress"`);
    await queryRunner.query(`DROP TABLE "indicator_year_targets"`);
    await queryRunner.query(
      `DROP INDEX "public"."UQ_RESULT_CODE_PER_OBJECTIVE"`,
    );
    await queryRunner.query(`DROP TABLE "results"`);
    await queryRunner.query(
      `DROP INDEX "public"."UQ_OBJECTIVE_CODE_PER_PROGRAM"`,
    );
    await queryRunner.query(`DROP TABLE "objectives"`);
    await queryRunner.query(`DROP INDEX "public"."UQ_PROGRAM_CODE_PER_PLAN"`);
    await queryRunner.query(`DROP TABLE "programs"`);
    await queryRunner.query(`DROP INDEX "public"."UQ_STRATEGIC_PLAN_PERIOD"`);
    await queryRunner.query(`DROP TABLE "strategic_plans"`);
    await queryRunner.query(
      `DROP INDEX "public"."UQ_ACTIVITY_CODE_PER_RESULT"`,
    );
    await queryRunner.query(`DROP TABLE "activities"`);
    await queryRunner.query(
      `ALTER TABLE "organization_users" ADD CONSTRAINT "FK_org_user_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "organization_users" ADD CONSTRAINT "FK_org_user_organization" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
