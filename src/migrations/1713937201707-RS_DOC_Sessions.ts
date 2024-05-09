import { MigrationInterface, QueryRunner } from 'typeorm';

export class RSDOCSessions1713937201707 implements MigrationInterface {
  name = 'RSDOCSessions1713937201707';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE \`RS_DOC_Sessions\` (
                \`rs_id\` int NOT NULL AUTO_INCREMENT,
                \`rs_date\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
                \`rs_ip\` varchar(255) NOT NULL DEFAULT '',
                \`rs_agent\` varchar(255) NOT NULL DEFAULT '',
                \`rs_accessHash\` varchar(64) NOT NULL DEFAULT '',
                \`rs_refreshHash\` varchar(64) NOT NULL DEFAULT '',
                \`rs_userId\` int NOT NULL,
                PRIMARY KEY (\`rs_id\`)
            ) ENGINE = InnoDB
        `);
    await queryRunner.query(`
            ALTER TABLE \`RS_DOC_Sessions\`
            ADD CONSTRAINT \`FK_3adbb1a52b024c305a362a30eaf\` FOREIGN KEY (\`rs_userId\`) REFERENCES \`RS_CTL_Users\`(\`rs_id\`) ON DELETE CASCADE ON UPDATE NO ACTION
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE \`RS_DOC_Sessions\` DROP FOREIGN KEY \`FK_3adbb1a52b024c305a362a30eaf\`
        `);
    await queryRunner.query(`
            DROP TABLE \`RS_DOC_Sessions\`
        `);
  }
}
