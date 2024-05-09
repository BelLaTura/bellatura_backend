import * as bcrypt from 'bcryptjs';
import { SHA256 } from 'crypto-js';
import { Request, Response } from 'express';
import { Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpException, Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions, JwtVerifyOptions } from '@nestjs/jwt';
import {
  CreateSessionBodyDto,
  CreateSessionResponseDto,
  CreateSessionsResponseDataDto,
  DeleteSessionResponseDto,
  DeleteSessionsResponseDto,
  GetSessionReponseDataDto,
  GetSessionReponseDto,
  GetSessionsReponseDataDto,
  GetSessionsReponseDto,
  UpdateSessionReponseDataDto,
  UpdateSessionReponseDto,
} from './sessions.dto';
import GetResponse from 'src/utils/getResponse';
import { AppRequestDto } from 'src/types/app-request.dto';
import RS_CTL_Users from 'src/entities/RS_CTL_Users.entity';
import { RS_DOC_Sessions } from 'src/entities/RS_DOC_Sessions.entity';
import { TokenPayloadDto, TokenTypes } from 'src/types/token-payload.dto';

@Injectable()
export class SessionsService {
  constructor(
    private readonly jwtService: JwtService,

    @InjectRepository(RS_CTL_Users)
    private readonly userRepo: Repository<RS_CTL_Users>,

    @InjectRepository(RS_DOC_Sessions)
    private readonly sessionRepo: Repository<RS_DOC_Sessions>,
  ) {}

  /**
   * Функция
   * - проверяет существование электронной почты в БД
   * - проверяет сходится ли хэш в БД с хэшек переданного пароля
   * - создает access токен
   * - создает refresh токен
   * - создает хэш access токен
   * - создает хэш refresh токена
   * - создает запись сессии в БД
   * @param body
   * @param req
   * @param res
   * @returns
   */
  async create(body: CreateSessionBodyDto, req: Request, res: Response) {
    const loginOrEmail = body.rs_loginOrEmail;
    const candidate = await this.userRepo.findOne({
      where: [{ rs_email: loginOrEmail }, { rs_login: loginOrEmail }],
    });

    if (!candidate) {
      const message = loginOrEmail.includes('@')
        ? 'Нет пользователя с такой электронной почтой'
        : 'Нет пользователя с таким логином';
      const data = {};
      const json = GetResponse.getConflictResponse(message, data);
      return res.status(json.statusCode).send(json);
    }

    const str = body.rs_password;
    const hash = candidate.rs_passwordHash;
    const isVerifyPassword = bcrypt.compareSync(str, hash);

    if (!isVerifyPassword) {
      const message = 'Не тот пароль';
      const data = {};
      const json = GetResponse.getConflictResponse(message, data);
      return res.status(json.statusCode).send(json);
    }

    const userId = candidate.rs_id;
    const ip = this.getIp(req);
    const agent = this.getAgent(req);

    const access = await this.generateToken(userId, TokenTypes.accessToken);
    const refresh = await this.generateToken(userId, TokenTypes.refreshToken);

    const accessTokenHash = SHA256(access).toString();
    const refreshTokenHash = SHA256(refresh).toString();

    const saveCandidate = await this.sessionRepo.save({
      rs_accessHash: accessTokenHash,
      rs_refreshHash: refreshTokenHash,
      rs_ip: ip,
      rs_agent: agent,
      rs_userId: userId,
    });

    const data: CreateSessionsResponseDataDto = {
      rs_accessToken: access,
      rs_refreshToken: refresh,
      rs_id: saveCandidate.rs_id,
      rs_ip: saveCandidate.rs_ip,
      rs_agent: saveCandidate.rs_agent,
      rs_date: saveCandidate.rs_date,
      rs_userId: saveCandidate.rs_userId,
    };
    const json: CreateSessionResponseDto = GetResponse.getCreatedResponse(
      'Сессия создана',
      data,
    );
    return res.status(json.statusCode).json(json);
  }

  /**
   * Функция для получения списка сессий по userId и хэшу access токена
   * @param req
   * @param res
   * @returns
   */
  async findAll(req: AppRequestDto, res: Response) {
    const userId = req.custom__userId || 0;
    const accessTokenHash = req.custom__accessHash || '';

    const currentSession = await this.sessionRepo.findOne({
      select: {
        rs_id: true,
        rs_ip: true,
        rs_agent: true,
        rs_date: true,
        rs_userId: true,
      },
      where: {
        rs_userId: userId,
        rs_accessHash: accessTokenHash,
      },
    });

    const otherSessions = await this.sessionRepo.find({
      select: {
        rs_id: true,
        rs_ip: true,
        rs_agent: true,
        rs_date: true,
        rs_userId: true,
      },
      where: {
        rs_userId: userId,
        rs_accessHash: Not(accessTokenHash),
      },
      order: {
        rs_date: 'DESC',
      },
    });

    const data: GetSessionsReponseDataDto = {
      current_session: currentSession,
      other_sessions: otherSessions,
    };

    const json: GetSessionsReponseDto = GetResponse.getOkResponse(
      'Получили список сессий',
      data,
    );
    return res.status(json.statusCode).send(json);
  }

  /**
   * Функция для получения сессии по id и по userId
   * @param id
   * @param req
   * @param res
   * @returns
   */
  async findOne(id: number, req: AppRequestDto, res: Response) {
    const session = await this.sessionRepo.findOneOrFail({
      select: {
        rs_id: true,
        rs_ip: true,
        rs_agent: true,
        rs_date: true,
        rs_userId: true,
      },
      where: {
        rs_id: id,
      },
    });

    const data: GetSessionReponseDataDto = session;
    const json: GetSessionReponseDto = GetResponse.getOkResponse(
      'Получили сессию по id',
      data,
    );
    return res.status(json.statusCode).send(json);
  }

  /**
   * Функция для получения нового access токена из refresh токена и userId
   * @param req
   * @param res
   */
  async update(req: AppRequestDto, res: Response) {
    const userId = req.custom__userId || 0;
    const resreshTokenHash = req.custom__refreshHash || '';
    const ip = this.getIp(req);
    const agent = this.getAgent(req);

    const accessToken = await this.generateToken(
      userId,
      TokenTypes.accessToken,
    );
    const accessTokenHash = SHA256(accessToken).toString();

    await this.sessionRepo.update(
      {
        rs_userId: userId,
        rs_refreshHash: resreshTokenHash,
      },
      {
        rs_accessHash: accessTokenHash,
        rs_ip: ip,
        rs_agent: agent,
      },
    );

    const candidate = await this.sessionRepo.findOne({
      select: {
        rs_id: true,
        rs_ip: true,
        rs_agent: true,
        rs_date: true,
        rs_userId: true,
      },
      where: {
        rs_userId: userId,
        rs_refreshHash: resreshTokenHash,
      },
    });

    const data: UpdateSessionReponseDataDto = candidate;
    const json: UpdateSessionReponseDto = GetResponse.getOkResponse(
      'Access токен обновлен',
      data,
    );
    return res.status(json.statusCode).json(json);
  }

  /**
   * Функция для удаления сессии по id и userId
   * @param id
   * @param req
   * @param res
   * @returns
   */
  async remove(id: number, req: AppRequestDto, res: Response) {
    const userId = req.custom__userId || 0;
    const candidate = await this.sessionRepo.findOne({
      select: { rs_id: true },
      where: {
        rs_userId: userId,
        rs_id: id,
      },
    });

    if (!candidate) {
      const data = {};
      const json = GetResponse.getNotFoundResponse(
        'Сессия не найдена по id',
        data,
      );
      return res.status(json.statusCode).send(json);
    }

    await this.sessionRepo.delete({
      rs_userId: userId,
      rs_id: id,
    });

    const data = {};
    const json: DeleteSessionResponseDto = GetResponse.getOkResponse(
      'Сессия удалена по id',
      data,
    );
    return res.status(json.statusCode).send(json);
  }

  async removeAll(req: AppRequestDto, res: Response) {
    const userId = req.custom__userId || 0;

    await this.sessionRepo.delete({
      rs_userId: userId,
    });

    const data = {};
    const json: DeleteSessionsResponseDto = GetResponse.getOkResponse(
      'Все сессии удалены',
      data,
    );
    return res.status(json.statusCode).send(json);
  }

  async generateToken(userId: number, tokenType: TokenTypes) {
    let options: JwtSignOptions;
    switch (tokenType) {
      case TokenTypes.refreshToken:
        options = {
          secret: process.env.APP__JWT_SECRET_REFRESH,
          expiresIn: process.env.APP__JWT_EXPIRE_REFRESH,
        };
        break;
      case TokenTypes.accessToken:
        options = {
          secret: process.env.APP__JWT_SECRET_ACCESS,
          expiresIn: process.env.APP__JWT_EXPIRE_ACCESS,
        };
        break;
      case TokenTypes.activationToken:
        options = {
          secret: process.env.APP__JWT_SECRET_ACTIVATION,
          expiresIn: process.env.APP__JWT_EXPIRE_ACTIVATION,
        };
        break;
      case TokenTypes.newEmailToken:
        options = {
          secret: process.env.APP__JWT_SECRET_NEW_EMAIL,
          expiresIn: process.env.APP__JWT_EXPIRE_NEW_EMAIL,
        };
        break;
    }

    const payload: TokenPayloadDto = {
      id: userId,
      type: tokenType,
    };
    const token = await this.jwtService.sign(payload, options);
    return token;
  }

  async verifyToken(
    token: string,
    tokenType: TokenTypes,
  ): Promise<TokenPayloadDto> {
    let options: JwtVerifyOptions = {};

    switch (tokenType) {
      case TokenTypes.refreshToken:
        options = {
          secret: process.env.APP__JWT_SECRET_REFRESH,
        };
        break;
      case TokenTypes.accessToken:
        options = {
          secret: process.env.APP__JWT_SECRET_ACCESS,
        };
        break;
      case TokenTypes.activationToken:
        options = {
          secret: process.env.APP__JWT_SECRET_ACTIVATION,
        };
        break;
      case TokenTypes.newEmailToken:
        options = {
          secret: process.env.APP__JWT_SECRET_NEW_EMAIL,
        };
        break;
    }

    let payload: any = {};
    try {
      payload = await this.jwtService.verify(token, options);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        const data = {};
        const message = 'Токен просрочен';
        const json = GetResponse.getUnauthorizedResponse(message, data);
        throw new HttpException(json, json.statusCode);
      }
    }

    const PAYLOAD: TokenPayloadDto = payload;
    if (PAYLOAD.type !== tokenType) {
      const data = {};
      const message = `Токен не имеет тип ${tokenType}`;
      const json = GetResponse.getUnauthorizedResponse(message, data);
      throw new HttpException(json, json.statusCode);
    }

    return PAYLOAD;
  }

  getBearerToken(req: Request): string {
    const reqHeaders: any = req.headers;
    const authHeader: string = reqHeaders.authorization;

    const bearer = authHeader?.split(' ')[0];
    const token = authHeader?.split(' ')[1];

    if (bearer != 'Bearer' || !token) {
      const data = {};
      const message = 'Bearer токен не передан';
      const json = GetResponse.getUnauthorizedResponse(message, data);
      throw new HttpException(json, json.statusCode);
    }

    return token;
  }

  async getVerifyAccessToken(token: string): Promise<TokenPayloadDto> {
    const payload = await this.verifyToken(token, TokenTypes.accessToken);
    return payload;
  }

  async getAccessHashs(userId: number) {
    const sessions = await this.sessionRepo.find({
      select: {
        rs_accessHash: true,
      },
      where: {
        rs_userId: userId,
      },
    });
    return sessions;
  }

  getIp(req: Request): string {
    return (
      `${req?.headers['x-forwarded-for'] || req?.connection.remoteAddress}` ||
      ''
    );
  }

  getAgent(req: Request): string {
    return `${req?.headers['user-agent'] || ''}`;
  }
}
