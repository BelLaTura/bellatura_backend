export enum TokenTypes {
  accessToken = 'access',
  refreshToken = 'refresh',
  activationToken = 'activation',
  newEmailToken = 'new-email',
}

export interface TokenPayloadDto {
  type: TokenTypes;
  id: number;
}
