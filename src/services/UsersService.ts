import * as superagent from 'superagent';
import { IUser, IUsersService } from '..';
import { Constants } from '../models/Constants';
import { TokenService } from './TokenService';

// import { IUsersService, IUser } from 'index';
// import { IUsersService, IUser } from '..';
export class UsersService implements IUsersService {
  private authenticationId: string;
  private constants: Constants;
  private tokenService: TokenService;
  constructor(authId: string, constants: Constants, tokenService: TokenService) {
    this.authenticationId = authId;
    this.constants = constants;
    this.tokenService = tokenService;
  }
  public getSelf = () => {
    return new Promise<IUser>((resolve, reject) => {
      this.tokenService.getAccessToken(this.authenticationId).then(accessToken => {
        superagent
          .get(`${this.constants.apiUrl}/users/me`)
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
  public updateSelf = (user: IUser) => {
    return new Promise<IUser>((resolve, reject) => {
      this.tokenService.getAccessToken(this.authenticationId).then(accessToken => {
        superagent
          .put(`${this.constants.apiUrl}/users/me`)
          .set('tenant', this.constants.tenant)
          .set('Authorization', `Bearer ${accessToken}`)
          .send(user)
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
