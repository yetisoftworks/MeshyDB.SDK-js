import * as superagent from 'superagent';
import { INewUser, IPasswordResetHash, IUser } from '..';
import { Constants } from '../models/Constants';
import { ForgotPassword } from '../models/ForgotPassword';
import { ResetPassword } from '../models/ResetPassword';
import { Utils } from './Utils';

export class UserService {
  private constants: Constants;
  constructor(constants: Constants) {
    this.constants = constants;
  }
  public createUser = (newUser: INewUser) => {
    return new Promise<IUser>((resolve, reject) => {
      superagent
        .post(`${this.constants.apiUrl}/users`)
        .send(newUser)
        .set('tenant', this.constants.tenant)
        .end((err, resp) => {
          if (!resp.ok) {
            reject(err);
            return;
          }
          resolve(resp.body);
        });
    });
  };
  public forgotPassword = (forgotPassword: ForgotPassword) => {
    return new Promise<IPasswordResetHash>((resolve, reject) => {
      superagent
        .post(`${this.constants.apiUrl}/users/forgotpassword`)
        .send(forgotPassword)
        .set('tenant', this.constants.tenant)
        .end((err, resp) => {
          if (!resp.ok) {
            reject(err);
            return;
          }
          resolve(JSON.parse(JSON.stringify(resp.body), Utils.jsonReviver));
        });
    });
  };
  public resetPassword = (passwordResetHash: IPasswordResetHash, newPassword: string) => {
    return new Promise<void>((resolve, reject) => {
      const passwordReset = new ResetPassword();
      passwordReset.expires = passwordResetHash.expires;
      passwordReset.hash = passwordResetHash.hash;
      passwordReset.username = passwordResetHash.username;
      passwordReset.newPassword = newPassword;
      superagent
        .post(`${this.constants.apiUrl}/users/resetpassword`)
        .set('tenant', this.constants.tenant)
        .send(passwordReset)
        .end((err, resp) => {
          if (!resp.ok) {
            reject(err);
            return;
          }
          resolve();
        });
    });
  };
}
