import { Request } from 'express';

export interface AppRequestDto extends Request {
  custom__accessHash?: string;
  custom__refreshHash?: string;
  custom__userId?: number;
}
