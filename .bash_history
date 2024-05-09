npx @nestjs/cli new ref-system-backend --directory ./ --package-manager yarn --language TypeScript

yarn add @nestjs/config
yarn add @nestjs/swagger
yarn add swagger-ui-express
yarn add mysql2
yarn add @nestjs/typeorm
yarn add typeorm
yarn add class-validator
yarn add class-transformer
yarn add bcryptjs
yarn add -D @types/bcryptjs
yarn add @nestjs/jwt
yarn add bcryptjs
yarn add -D @types/bcryptjs
yarn add crypto-js

yarn add @nestjs-modules/mailer
yarn add nodemailer
yarn add handlebars
yarn add @types/nodemailer
yarn add @css-inline/css-inline
yarn add @css-inline/css-inline-linux-x64-gnu

yarn install --ignore-engines --ignore-platform

yarn nest g res api/v1/users
yarn migration-gen src/migrations/RS_CTL_Users

yarn nest g res api/v1/sessions
yarn migration-gen src/migrations/RS_DOC_Sessions

yarn migration-gen src/migrations/RS_DOC_ActivationAccount
