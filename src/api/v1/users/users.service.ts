import * as bcrypt from 'bcryptjs';
import { Response } from 'express';
import GetResponse from 'src/utils/getResponse';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { HttpStatus, Injectable } from '@nestjs/common';
import {
  QueryCreateUserDto,
  QueryUserForgetPasswordDto,
  QueryGetUserDto,
  QueryPatchUserDto,
  QueryUserChangePasswordDto,
} from './users.dto';
import { TokenTypes } from 'src/types/token-payload.dto';
import { AppRequestDto } from 'src/types/app-request.dto';
import RS_CTL_Users from 'src/entities/RS_CTL_Users.entity';
import { SessionsService } from '../sessions/sessions.service';
import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { RS_DOC_ActivationAccount } from 'src/entities/RS_DOC_ActivationAccount.entity';

const SALT = 5;

@Injectable()
export class UsersService {
  constructor(
    private readonly sessionService: SessionsService,
    private readonly mailerService: MailerService,
    private readonly dataSource: DataSource,
    @InjectRepository(RS_CTL_Users)
    private readonly RsCtlUsersRepository: Repository<RS_CTL_Users>,
    @InjectRepository(RS_DOC_ActivationAccount)
    private readonly RsDocActivationAccountRepository: Repository<RS_DOC_ActivationAccount>,
  ) {}

  async create(res: Response, dto: QueryCreateUserDto) {
    console.log(' < < < < < < < < РЕГИСТРАЦИЯ');
    console.log(' - - - - - - - - Поиск кандидата по email');
    const EMAIL_CANDIDATE = await this.RsCtlUsersRepository.findOne({
      where: { rs_email: dto.rs_email },
    });

    if (EMAIL_CANDIDATE) {
      const response = GetResponse.getConflictResponse('E-mail уже занят', {});
      return res.status(HttpStatus.CONFLICT).send(response);
    }

    console.log(' - - - - - - - - Поиск кандидата по логину');
    const LOGIN_CANDIDATE = await this.RsCtlUsersRepository.findOne({
      where: { rs_login: dto.rs_login },
    });

    if (LOGIN_CANDIDATE) {
      const response = GetResponse.getConflictResponse('Логин уже занят', {});
      return res.status(HttpStatus.CONFLICT).send(response);
    }

    console.log(' - - - - - - - - старт транзакции');
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      console.log(' - - - - - - - - создание хэша пароля');
      const PASSWORD = dto.rs_password;
      const HASH_PASSWORD = await bcrypt.hash(PASSWORD, SALT);

      console.log(' - - - - - - - - поиск реферала');
      let ref: number = 0;
      const REF_CANDIDATE = await queryRunner.manager
        .getRepository(RS_CTL_Users)
        .findOne({
          where: {
            rs_id: dto.rs_ref,
          },
        });

      if (REF_CANDIDATE) {
        ref = REF_CANDIDATE.rs_id;
      }

      console.log(' - - - - - - - - создание пользователя');
      const userData = await queryRunner.manager
        .getRepository(RS_CTL_Users)
        .save({
          ...dto,
          rs_id: 0,
          rs_ref: ref,
          rs_passwordHash: HASH_PASSWORD,
          rs_isActivated: false,
        });

      const userId = userData.rs_id;
      const email = userData.rs_email;
      const activationToken = await this.sessionService.generateToken(
        userId,
        TokenTypes.activationToken,
      );

      console.log(' - - - - - - - - создание токена активации');
      await queryRunner.manager.getRepository(RS_DOC_ActivationAccount).save({
        rs_token: activationToken,
        rs_userId: userId,
      });

      await queryRunner.commitTransaction();
      try {
        const sendMailOptions: ISendMailOptions = {
          to: email,
          subject: 'Активация аккаунта',
          template: 'activate-email',
          context: {
            rs_url: `${process.env.APP__SWAGGER_HOST}/api/v1/users/x/activate-account/${activationToken}`,
            rs_org: '...',
          },
        };

        console.log(` - - - - - - - - отправка почты на ${email}`);
        await this.mailerService.sendMail(sendMailOptions);
        console.log(' - - - - - - - - конец отправки');
      } catch (exception) {
        console.log(exception);
      }

      const response = GetResponse.getOkResponse(
        'Пользователь зарегистрирован',
        {},
      );

      console.log(' > > > > > > > > КОНЕЦ РЕГИСТРАЦИИ');
      return res.status(response.statusCode).send(response);
    } catch (exception) {
      await queryRunner.rollbackTransaction();
      console.log(` ! ! ! ! ! ! ! ! Регистрация не выполнена: ${exception}`);
      const response = GetResponse.getConflictResponse(
        'Транзакция не выполнена: ' + exception,
        {
          exception: '' + exception,
        },
      );
      return res.status(response.statusCode).send(response);
    }
  }

  async findAll(res: Response, query: QueryGetUserDto, req: AppRequestDto) {
    const ref = req.custom__userId || 0;
    const generations = query.generations <= 0 ? 1 : query.generations;

    const main = await this.RsCtlUsersRepository.findOneOrFail({
      select: {
        rs_middlename: true,
        rs_name: true,
        rs_surname: true,
        rs_id: true,
        rs_ref: true,
        rs_address: true,
        rs_birthday: true,
        rs_email: true,
        rs_phone: true,
        rs_telegramNickname: true,
        rs_viberPhone: true,
        rs_whatsappPhone: true,
        rs_isActivated: false,
        rs_login: false,
        rs_passwordHash: false,
      },
      where: {
        rs_id: ref,
      },
    });

    let arr = [main];

    let findRef: number[] = [ref];

    for (let i = 0; i < generations; ++i) {
      const candidates = await this.RsCtlUsersRepository.find({
        select: {
          rs_middlename: true,
          rs_name: true,
          rs_surname: true,
          rs_id: true,
          rs_ref: true,
          rs_address: true,
          rs_birthday: true,
          rs_email: true,
          rs_phone: true,
          rs_telegramNickname: true,
          rs_viberPhone: true,
          rs_whatsappPhone: true,
          rs_isActivated: true,
          rs_login: false,
          rs_passwordHash: false,
        },
        where: {
          rs_ref: In(findRef),
        },
      });

      if (candidates.length === 0) {
        break;
      }

      findRef = candidates.map((e) => {
        return e.rs_id;
      });

      arr = [...arr, ...candidates];
    }

    const json = GetResponse.getOkResponse('Массив пользователей получен', arr);
    return res.status(json.statusCode).send(json);
  }

  async findOne(res: Response, id: number) {
    const candidate = await this.RsCtlUsersRepository.findOneOrFail({
      select: {
        rs_middlename: true,
        rs_name: true,
        rs_surname: true,
        rs_id: true,
        rs_ref: true,
        rs_address: true,
        rs_birthday: true,
        rs_email: true,
        rs_phone: true,
        rs_telegramNickname: true,
        rs_viberPhone: true,
        rs_whatsappPhone: true,
        rs_isActivated: true,
        rs_login: false,
        rs_passwordHash: false,
      },
      where: {
        rs_id: id,
      },
    });

    const json = GetResponse.getOkResponse(
      'Получили пользователя по id',
      candidate,
    );

    return res.status(json.statusCode).send(json);
  }

  async activateAccount(res: Response, activationToken) {
    // let userId = 0;
    // try {
    //   const payload = await this.sessionService.verifyToken(
    //     activationToken,
    //     TokenTypes.activationToken,
    //   );
    //   userId = payload.id;
    // } catch (err) {
    //   if (err.name === 'TokenExpiredError') {
    //     const message = `Ссылка не действительна, так как прошло 24 часа err=(${err})`;
    //     const response = GetResponse.getNotFoundResponse(message, {
    //       exception: '' + err,
    //     });
    //     return res.status(response.statusCode).send(response);
    //   }
    //   const message = `Ссылка не действительна, так как токен подделан err=(${err})`;
    //   const response = GetResponse.getNotFoundResponse(message, {
    //     exception: '' + err,
    //   });
    //   return res.status(response.statusCode).send(response);
    // }

    console.log(' < < < < < < < < АКТИВАЦИЯ АККАУНТА');
    console.log(' - - - - - - - - поиск записи активации аккаунта по токену');
    const candidate = await this.RsDocActivationAccountRepository.findOne({
      where: {
        rs_token: activationToken,
      },
    });

    if (!candidate) {
      console.log(' ! ! ! ! ! ! ! ! ТОКЕНА АКТИВАЦИИ НЕТ В БД');
      const message =
        'Ссылка не действительная, так как такой токен не зарегстрирован в БД';
      const response = GetResponse.getNotFoundResponse(message, {});
      return res.status(response.statusCode).send(response);
    }

    console.log(' - - - - - - - - поиск пользователя по id');
    const userCandidate = await this.RsCtlUsersRepository.findOne({
      where: {
        rs_id: candidate.rs_userId,
      },
    });

    if (!userCandidate) {
      console.log(' ! ! ! ! ! ! ! ! НЕТ ПОЛЬЗОВАТЕЛЯ БД');
      const response = GetResponse.getConflictResponse(
        'Пользователь не найден в БД',
        {},
      );
      return res.status(response.statusCode).send(response);
    }

    if (userCandidate.rs_isActivated) {
      console.log(' ! ! ! ! ! ! ! ! аккаунт уже был активирован :)');
      const response = GetResponse.getConflictResponse('', {});
      const html =
        '<p style="font-size: 3em;">Аккаунт уже был активирован</p>' +
        '<p><a style="font-size: 2em;" href="https://bellatura.by/account">Вернуться на сайт</a></p>';
      return res.status(response.statusCode).send(html);
    }

    console.log(' - - - - - - - - установка флага, что аккаунт активирован');
    await this.RsCtlUsersRepository.update(candidate.rs_userId, {
      rs_isActivated: true,
    });

    console.log(' > > > > > > > > КОНЕЦ АКТИВАЦИИ АККАУНТА');
    const response = GetResponse.getOkResponse('', {});
    const html =
      '<p style="font-size: 3em;">Аккаунт активирован</p>' +
      '<p><a style="font-size: 2em;" href="https://bellatura.by/account">Вернуться на сайт</a></p>';
    return res.status(response.statusCode).send(html);
  }

  async getNewActivationAccout(res: Response, req: AppRequestDto) {
    const userId = req.custom__userId;

    const candidate = await this.RsCtlUsersRepository.findOne({
      where: {
        rs_id: userId,
      },
    });

    if (!candidate) {
      const message = `Пользователь не найден в БД (id = ${userId})`;
      const json = GetResponse.getConflictResponse(message, {});
      return res.status(json.statusCode).send(json);
    }

    const activationToken = await this.sessionService.generateToken(
      userId,
      TokenTypes.activationToken,
    );

    console.log(' - - - - - - - - создание токена активации');
    await this.RsDocActivationAccountRepository.save({
      rs_token: activationToken,
      rs_userId: userId,
    });

    try {
      const sendMailOptions: ISendMailOptions = {
        to: candidate.rs_email,
        subject: 'Активация аккаунта',
        template: 'activate-email',
        context: {
          rs_url: `${process.env.APP__SWAGGER_HOST}/api/v1/users/x/activate-account/${activationToken}`,
          rs_org: '...',
        },
      };

      console.log(` - - - - - - - - отправка почты на ${candidate.rs_email}`);
      await this.mailerService.sendMail(sendMailOptions);
      console.log(' - - - - - - - - конец отправки');
    } catch (exception) {
      console.log(exception);
      throw new Error(`Сообщение не отправлено на почту (${exception})`);
    }

    const message =
      'Сообщение с ссылкой активаией аккаунта отправлено на почту';
    const json = GetResponse.getOkResponse(message, {});
    return res.status(json.statusCode).send(json);
  }

  async findMyData(res: Response, req: AppRequestDto) {
    const ref = req.custom__userId || 0;
    if (ref === 0) {
      const json = GetResponse.getUnauthorizedResponse(
        'Не указан access токен',
        {},
      );
      return res.status(json.statusCode).send(json);
    }

    const candidate = await this.RsCtlUsersRepository.findOneOrFail({
      select: {
        rs_passwordHash: false,
        rs_address: true,
        rs_birthday: true,
        rs_email: true,
        rs_id: true,
        rs_login: true,
        rs_middlename: true,
        rs_name: true,
        rs_phone: true,
        rs_ref: true,
        rs_surname: true,
        rs_telegramNickname: true,
        rs_viberPhone: true,
        rs_whatsappPhone: true,
        rs_isActivated: true,
        rs_createdAt: true,
      },
      where: {
        rs_id: ref,
      },
    });

    const json = GetResponse.getOkResponse('Получили пользователя', candidate);

    return res.status(json.statusCode).send(json);
  }

  async forgetPassword(res: Response, body: QueryUserForgetPasswordDto) {
    const candidate = await this.RsCtlUsersRepository.findOne({
      select: {
        rs_id: true,
        rs_email: true,
        rs_login: true,
      },
      where: [
        { rs_login: body.rs_loginOrEmail },
        { rs_email: body.rs_loginOrEmail },
      ],
    });

    if (!candidate) {
      const json = GetResponse.getConflictResponse(
        `Не найден аккаунт с таким логином или почтой (${body.rs_loginOrEmail})`,
        {},
      );
      return res.status(json.statusCode).send(json);
    }

    const id = candidate.rs_id;
    const email = candidate.rs_email;
    const login = candidate.rs_login;

    const randomString: string = await bcrypt.hash(new Date().toJSON(), SALT);
    const newPasswordStr = randomString.slice(10, 26).replace(/\//g, 'x');
    const newPasswordSalt = SALT;
    const newPasswordHash = await bcrypt.hash(newPasswordStr, newPasswordSalt);

    const sendMailOptions: ISendMailOptions = {
      to: email,
      subject: 'Восстановление пароля',
      template: 'forget-password',
      context: {
        rs_login: login,
        rs_password: newPasswordStr,
        rs_org: '...',
      },
    };

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await queryRunner.manager.getRepository(RS_CTL_Users).update(id, {
        rs_passwordHash: newPasswordHash,
      });

      await this.mailerService.sendMail(sendMailOptions);
      await queryRunner.commitTransaction();

      const json = GetResponse.getOkResponse(
        'Новый пароль отправлен на email',
        {},
      );
      return res.status(json.statusCode).send(json);
    } catch (exception) {
      const json = GetResponse.getConflictResponse(
        'Транзакция не выполнена: ' + exception,
        {
          exception: '' + exception,
        },
      );
      return res.status(json.statusCode).send(json);
    }
  }

  async patchUser(res: Response, dto: QueryPatchUserDto, req: AppRequestDto) {
    const userId = req.custom__userId;
    await this.RsCtlUsersRepository.update(userId, {
      rs_telegramNickname: dto.rs_telegramNickname,
      rs_viberPhone: dto.rs_viberPhone,
      rs_whatsappPhone: dto.rs_whatsappPhone,
    });
    const json = GetResponse.getOkResponse('Обновление произошло успешно', {});
    return res.status(json.statusCode).send(json);
  }

  async changePassword(
    res: Response,
    dto: QueryUserChangePasswordDto,
    req: AppRequestDto,
  ) {
    const userId = req.custom__userId;
    const PASSWORD = dto.rs_password;
    const HASH_PASSWORD = await bcrypt.hash(PASSWORD, SALT);

    await this.RsCtlUsersRepository.update(userId, {
      rs_passwordHash: HASH_PASSWORD,
    });

    const json = GetResponse.getOkResponse('Пароль успешно изменён', {});
    return res.status(json.statusCode).send(json);
  }
}
