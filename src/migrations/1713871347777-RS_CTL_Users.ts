import { MigrationInterface, QueryRunner } from 'typeorm';

export class RSCTLUsers1713871347777 implements MigrationInterface {
  name = 'RSCTLUsers1713871347777';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE \`RS_CTL_Users\` (
              \`rs_id\` int NOT NULL AUTO_INCREMENT,
              \`rs_ref\` int NOT NULL DEFAULT '0',
              \`rs_email\` varchar(64) NOT NULL DEFAULT '',
              \`rs_login\` varchar(64) NOT NULL DEFAULT '',
              \`rs_surname\` varchar(32) NOT NULL DEFAULT '',
              \`rs_name\` varchar(32) NOT NULL DEFAULT '',
              \`rs_middlename\` varchar(32) NOT NULL DEFAULT '',
              \`rs_passwordHash\` varchar(255) NOT NULL DEFAULT '',
              \`rs_birthday\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
              \`rs_phone\` varchar(13) NOT NULL DEFAULT '',
              \`rs_address\` varchar(255) NOT NULL DEFAULT '',
              \`rs_telegramNickname\` varchar(64) NOT NULL DEFAULT '',
              UNIQUE INDEX \`UNI_RsCtlUsers_email\` (\`rs_email\`),
              UNIQUE INDEX \`UNI_RsCtlUsers_login\` (\`rs_login\`),
              PRIMARY KEY (\`rs_id\`)
            ) ENGINE = InnoDB
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP INDEX \`UNI_RsCtlUsers_email\` ON \`RS_CTL_Users\`
        `);
    await queryRunner.query(`
            DROP TABLE \`RS_CTL_Users\`
        `);
  }
}
