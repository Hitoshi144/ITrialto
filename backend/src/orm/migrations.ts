
import { MigrationInterface, QueryRunner } from 'typeorm';

 

export class AssigneeTaskColumn1715937742577 implements MigrationInterface {

  name = 'AssigneeTaskColumn1715937742577';

 

  public async up(queryRunner: QueryRunner): Promise<void> {

    await queryRunner.query(`ALTER TABLE "task" ADD "assigneeId" integer`);

    await queryRunner.query(

      `ALTER TABLE "task" ADD CONSTRAINT "FK_7384988f7eeb777e44802a0baca" FOREIGN KEY ("assigneeId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,

    );

    await queryRunner.query(`UPDATE "task" SET "assigneeId" = "authorId";`);

  }

 

  public async down(queryRunner: QueryRunner): Promise<void> {

    await queryRunner.query(

      `ALTER TABLE "task" DROP CONSTRAINT "FK_7384988f7eeb777e44802a0baca"`,

    );

    await queryRunner.query(`ALTER TABLE "task" DROP COLUMN "assigneeId"`);

  }

}