import { MigrationInterface, QueryRunner } from 'typeorm';

export class RSDOCActivationAccount1715158111612 implements MigrationInterface {
  name = 'RSDOCActivationAccount1715158111612';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE \`RS_DOC_ActivationAccount\` (
                \`rs_id\` int NOT NULL AUTO_INCREMENT,
                \`rs_date\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
                \`rs_token\` varchar(255) NOT NULL,
                \`rs_userId\` int NOT NULL,
                PRIMARY KEY (\`rs_id\`)
            ) ENGINE = InnoDB
        `);
    await queryRunner.query(`
            ALTER TABLE \`RS_DOC_ActivationAccount\`
            ADD CONSTRAINT \`FK_62b6c13444ca6ad6d40294b4bb7\` FOREIGN KEY (\`rs_userId\`) REFERENCES \`RS_CTL_Users\`(\`rs_id\`) ON DELETE CASCADE ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE \`RS_DOC_ActivationAccount\` DROP FOREIGN KEY \`FK_62b6c13444ca6ad6d40294b4bb7\`
        `);
    await queryRunner.query(`
            DROP TABLE \`RS_DOC_ActivationAccount\`
        `);
  }
}
