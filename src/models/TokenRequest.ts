export class TokenRequest {
  public client_id: string = '';
  public client_secret: string = '';
  public grant_type: string = 'password';
  public username: string = '';
  public password: string = '';
  public scope: string = 'meshy.api offline_access openid';
  public refresh_token: string = '';
}
