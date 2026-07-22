import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateProjectsModule1784584929116 implements MigrationInterface {
    name = 'CreateProjectsModule1784584929116'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "project_programs" ("project_id" integer NOT NULL, "program_id" integer NOT NULL, "strategic_plan_id" integer, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_613b8760aa538fc20b1b8f60c3d" PRIMARY KEY ("project_id", "program_id"))`);
        await queryRunner.query(`CREATE TYPE "public"."projects_status_enum" AS ENUM('DRAFT', 'ACTIVE', 'SUSPENDED', 'CLOSED')`);
        await queryRunner.query(`CREATE TABLE "projects" ("id" SERIAL NOT NULL, "organization_id" integer NOT NULL, "code" character varying(30) NOT NULL, "name" character varying(200) NOT NULL, "description" text, "start_date" date NOT NULL, "end_date" date NOT NULL, "status" "public"."projects_status_enum" NOT NULL DEFAULT 'DRAFT', "active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_6271df0a7aed1d6c0691ce6ac50" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "UQ_PROJECT_ORG_PERIOD" ON "projects" ("organization_id", "code") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "UQ_PROJECT_CODE" ON "projects" ("code") `);
        await queryRunner.query(`CREATE TABLE "project_indicator_year_targets" ("id" SERIAL NOT NULL, "indicator_id" integer NOT NULL, "year" smallint NOT NULL, "target_value" numeric(15,2) NOT NULL, "achieved_value" integer, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_PROJ_INDICATOR_YEAR" UNIQUE ("indicator_id", "year"), CONSTRAINT "PK_7515552fb692ed6719423c7dbec" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "project_indicator_progress" ("id" SERIAL NOT NULL, "indicator_id" integer NOT NULL, "progress_date" date NOT NULL, "current_value" numeric(15,2) NOT NULL, "observations" text, "registered_by" integer, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_05d78224852f3d13927a1242f34" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_PROJ_INDICATOR_PROGRESS" ON "project_indicator_progress" ("indicator_id", "progress_date") `);
        await queryRunner.query(`CREATE TABLE "project_indicator_alignments" ("id" SERIAL NOT NULL, "project_indicator_id" integer NOT NULL, "strategic_indicator_id" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_PROJ_INDICATOR_ALIGNMENT" UNIQUE ("project_indicator_id"), CONSTRAINT "PK_c1b408e698411eae933e20d25f3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."project_indicators_type_enum" AS ENUM('OBJECTIVE', 'RESULT', 'ACTIVITY')`);
        await queryRunner.query(`CREATE TABLE "project_indicators" ("id" SERIAL NOT NULL, "project_objective_id" integer, "project_result_id" integer, "project_activity_id" integer, "type" "public"."project_indicators_type_enum" NOT NULL, "code" character varying(30) NOT NULL, "name" character varying(250) NOT NULL, "description" text, "target_value" numeric(15,2) NOT NULL, "measurement_unit" character varying(100), "active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_035b7007e4d66f8951ac79103f6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "UQ_PROJ_INDICATOR_CODE" ON "project_indicators" ("code") `);
        await queryRunner.query(`CREATE TABLE "project_activities" ("id" SERIAL NOT NULL, "project_result_id" integer NOT NULL, "objective_indicator_id" integer, "result_indicator_id" integer, "code" character varying(30) NOT NULL, "name" character varying(250) NOT NULL, "description" text, "completion_percentage" numeric(5,2) NOT NULL DEFAULT '0', "start_date" date, "end_date" date, "active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_f322a4f9aed232d8868d54ec30c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "UQ_PROJ_ACTIVITY_CODE" ON "project_activities" ("project_result_id", "code") `);
        await queryRunner.query(`CREATE TABLE "project_results" ("id" SERIAL NOT NULL, "project_objective_id" integer NOT NULL, "code" character varying(30) NOT NULL, "name" character varying(250) NOT NULL, "description" text, "completion_percentage" numeric(5,2) NOT NULL DEFAULT '0', "active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "REL_f3e9824a60e131bba4c0013b2f" UNIQUE ("project_objective_id"), CONSTRAINT "PK_99fcd72042d2716bb9d29245ab8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "UQ_PROJ_RESULT_CODE" ON "project_results" ("project_objective_id", "code") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "UQ_PROJ_RESULT_OBJECTIVE" ON "project_results" ("project_objective_id") `);
        await queryRunner.query(`CREATE TABLE "project_objectives" ("id" SERIAL NOT NULL, "project_id" integer NOT NULL, "code" character varying(30) NOT NULL, "name" character varying(250) NOT NULL, "description" text, "completion_percentage" numeric(5,2) NOT NULL DEFAULT '0', "active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_5c8ffc180c1aaefa460f5b2015e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "UQ_PROJ_OBJECTIVE_CODE" ON "project_objectives" ("project_id", "code") `);
        await queryRunner.query(`ALTER TABLE "project_programs" ADD CONSTRAINT "FK_686e252aed0e8bfe7dc2a70e479" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project_programs" ADD CONSTRAINT "FK_35cd3c4b4c5e584744695090834" FOREIGN KEY ("program_id") REFERENCES "programs"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project_programs" ADD CONSTRAINT "FK_553d479869cbed9a16124797eef" FOREIGN KEY ("strategic_plan_id") REFERENCES "strategic_plans"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "projects" ADD CONSTRAINT "FK_585c8ce06628c70b70100bfb842" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project_indicator_year_targets" ADD CONSTRAINT "FK_4c04f14b3d66768037906d7879d" FOREIGN KEY ("indicator_id") REFERENCES "project_indicators"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project_indicator_progress" ADD CONSTRAINT "FK_7d4793feaaead0bd76e2718ec79" FOREIGN KEY ("indicator_id") REFERENCES "project_indicators"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project_indicator_progress" ADD CONSTRAINT "FK_84cc7234affbe14b360380a4aec" FOREIGN KEY ("registered_by") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project_indicator_alignments" ADD CONSTRAINT "FK_70930d1416674237ea2561cb068" FOREIGN KEY ("project_indicator_id") REFERENCES "project_indicators"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project_indicator_alignments" ADD CONSTRAINT "FK_f2c681f90aa3637182b2174596d" FOREIGN KEY ("strategic_indicator_id") REFERENCES "indicators"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project_indicators" ADD CONSTRAINT "FK_c12276bd3527abb3a6c9ba5f98a" FOREIGN KEY ("project_objective_id") REFERENCES "project_objectives"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project_indicators" ADD CONSTRAINT "FK_74c005a6624afe38a2ddff78a83" FOREIGN KEY ("project_result_id") REFERENCES "project_results"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project_indicators" ADD CONSTRAINT "FK_ad08c32265ad610a1df1c07df6e" FOREIGN KEY ("project_activity_id") REFERENCES "project_activities"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project_activities" ADD CONSTRAINT "FK_6bbb267d950bb237d163aaaaec4" FOREIGN KEY ("project_result_id") REFERENCES "project_results"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "project_activities" ADD CONSTRAINT "FK_ea08ee6b477ef375c2540ead950" FOREIGN KEY ("objective_indicator_id") REFERENCES "project_indicators"("id") ON DELETE SET NULL ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "project_activities" ADD CONSTRAINT "FK_0840b22bd769bf05edafc4082d9" FOREIGN KEY ("result_indicator_id") REFERENCES "project_indicators"("id") ON DELETE SET NULL ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "project_results" ADD CONSTRAINT "FK_f3e9824a60e131bba4c0013b2f0" FOREIGN KEY ("project_objective_id") REFERENCES "project_objectives"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project_objectives" ADD CONSTRAINT "FK_d11c94d0e614838e8ecaf3b5541" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project_indicators" ADD CONSTRAINT "chk_proj_indicator_type_rel" CHECK (
            (type='OBJECTIVE' AND project_objective_id IS NOT NULL
              AND project_result_id IS NULL AND project_activity_id IS NULL) OR
            (type='RESULT' AND project_result_id IS NOT NULL
              AND project_objective_id IS NULL AND project_activity_id IS NULL) OR
            (type='ACTIVITY' AND project_activity_id IS NOT NULL
              AND project_objective_id IS NULL AND project_result_id IS NULL)
        )`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project_indicators" DROP CONSTRAINT "chk_proj_indicator_type_rel"`);
        await queryRunner.query(`ALTER TABLE "project_objectives" DROP CONSTRAINT "FK_d11c94d0e614838e8ecaf3b5541"`);
        await queryRunner.query(`ALTER TABLE "project_results" DROP CONSTRAINT "FK_f3e9824a60e131bba4c0013b2f0"`);
        await queryRunner.query(`ALTER TABLE "project_activities" DROP CONSTRAINT "FK_0840b22bd769bf05edafc4082d9"`);
        await queryRunner.query(`ALTER TABLE "project_activities" DROP CONSTRAINT "FK_ea08ee6b477ef375c2540ead950"`);
        await queryRunner.query(`ALTER TABLE "project_activities" DROP CONSTRAINT "FK_6bbb267d950bb237d163aaaaec4"`);
        await queryRunner.query(`ALTER TABLE "project_indicators" DROP CONSTRAINT "FK_ad08c32265ad610a1df1c07df6e"`);
        await queryRunner.query(`ALTER TABLE "project_indicators" DROP CONSTRAINT "FK_74c005a6624afe38a2ddff78a83"`);
        await queryRunner.query(`ALTER TABLE "project_indicators" DROP CONSTRAINT "FK_c12276bd3527abb3a6c9ba5f98a"`);
        await queryRunner.query(`ALTER TABLE "project_indicator_alignments" DROP CONSTRAINT "FK_f2c681f90aa3637182b2174596d"`);
        await queryRunner.query(`ALTER TABLE "project_indicator_alignments" DROP CONSTRAINT "FK_70930d1416674237ea2561cb068"`);
        await queryRunner.query(`ALTER TABLE "project_indicator_progress" DROP CONSTRAINT "FK_84cc7234affbe14b360380a4aec"`);
        await queryRunner.query(`ALTER TABLE "project_indicator_progress" DROP CONSTRAINT "FK_7d4793feaaead0bd76e2718ec79"`);
        await queryRunner.query(`ALTER TABLE "project_indicator_year_targets" DROP CONSTRAINT "FK_4c04f14b3d66768037906d7879d"`);
        await queryRunner.query(`ALTER TABLE "projects" DROP CONSTRAINT "FK_585c8ce06628c70b70100bfb842"`);
        await queryRunner.query(`ALTER TABLE "project_programs" DROP CONSTRAINT "FK_553d479869cbed9a16124797eef"`);
        await queryRunner.query(`ALTER TABLE "project_programs" DROP CONSTRAINT "FK_35cd3c4b4c5e584744695090834"`);
        await queryRunner.query(`ALTER TABLE "project_programs" DROP CONSTRAINT "FK_686e252aed0e8bfe7dc2a70e479"`);
        await queryRunner.query(`DROP INDEX "public"."UQ_PROJ_OBJECTIVE_CODE"`);
        await queryRunner.query(`DROP TABLE "project_objectives"`);
        await queryRunner.query(`DROP INDEX "public"."UQ_PROJ_RESULT_OBJECTIVE"`);
        await queryRunner.query(`DROP INDEX "public"."UQ_PROJ_RESULT_CODE"`);
        await queryRunner.query(`DROP TABLE "project_results"`);
        await queryRunner.query(`DROP INDEX "public"."UQ_PROJ_ACTIVITY_CODE"`);
        await queryRunner.query(`DROP TABLE "project_activities"`);
        await queryRunner.query(`DROP INDEX "public"."UQ_PROJ_INDICATOR_CODE"`);
        await queryRunner.query(`DROP TABLE "project_indicators"`);
        await queryRunner.query(`DROP TYPE "public"."project_indicators_type_enum"`);
        await queryRunner.query(`DROP TABLE "project_indicator_alignments"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_PROJ_INDICATOR_PROGRESS"`);
        await queryRunner.query(`DROP TABLE "project_indicator_progress"`);
        await queryRunner.query(`DROP TABLE "project_indicator_year_targets"`);
        await queryRunner.query(`DROP INDEX "public"."UQ_PROJECT_CODE"`);
        await queryRunner.query(`DROP INDEX "public"."UQ_PROJECT_ORG_PERIOD"`);
        await queryRunner.query(`DROP TABLE "projects"`);
        await queryRunner.query(`DROP TYPE "public"."projects_status_enum"`);
        await queryRunner.query(`DROP TABLE "project_programs"`);
    }

}
