import * as superagent from 'superagent';
import { IMeshesService, IMeshyDbClient, IUsersService } from '..';
import { Constants } from '../models/Constants';
import { UserPasswordUpdate } from '../models/UserPasswordUpdate';
import { MeshesService } from './MeshesService';
import { TokenService } from './TokenService';
import { UsersService } from './UsersService';

export class MeshyDbClient implements IMeshyDbClient {
  public usersService: IUsersService;
  public meshesService: IMeshesService;
  private authenticationId: string;
  private constants: Constants;
  private tokenService: TokenService;
  constructor(authenticationId: string, constants: Constants, tokenService: TokenService) {
    this.authenticationId = authenticationId;
    this.constants = constants;
    this.tokenService = tokenService;
    this.usersService = new UsersService(authenticationId, constants, tokenService);
    this.meshesService = new MeshesService(authenticationId, constants, tokenService);
  }
  public updatePassword = (previousPassword: string, newPassword: string) => {
    if (!previousPassword) {
      throw new TypeError('Missing required parameter: previousPassword');
    }
    if (!newPassword) {
      throw new TypeError('Missing required parameter: newPassword');
    }
    const updatePassword = new UserPasswordUpdate();
    updatePassword.previousPassword = previousPassword;
    updatePassword.newPassword = newPassword;
    return new Promise<void>((resolve, reject) => {
      this.tokenService.getAccessToken(this.authenticationId).then(accessToken => {
        superagent
          .post(`${this.constants.apiUrl}/users/me/password`)
          .set('tenant', this.constants.tenant)
          .set('Authorization', `Bearer ${accessToken}`)
          .send(updatePassword)
          .end((err, resp) => {
            if (!resp.ok) {
              reject(err);
              return;
            }
            resolve();
          });
      });
    });
  };
  public signout = () => {
    return this.tokenService.signout(this.authenticationId);
  };
  public retrievePersistanceToken = () => {
    return this.tokenService.getRefreshToken(this.authenticationId);
  };
  public getMyUserInfo = () => {
    return new Promise<any>((resolve, reject) => {
      this.tokenService.getAccessToken(this.authenticationId).then(accessToken => {
        superagent
          .get(`${this.constants.authUrl}/connect/userinfo`)
          .set('tenant', this.constants.tenant)
          .set('Authorization', `Bearer ${accessToken}`)
          .end((err, resp) => {
            if (!resp.ok) {
              reject(err);
              return;
            }
            resolve(resp.body);
          });
      });
    });
  };
}
