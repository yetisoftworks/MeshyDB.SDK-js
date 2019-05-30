import { v4 as guid } from 'uuid';
import { IMeshyDb, IMeshyDbClient, INewUser, IPasswordResetHash } from '..';
import { Constants } from '../models/Constants';
import { ForgotPassword } from '../models/ForgotPassword';
import { MeshyDbClient } from './MeshyDbClient';
import { TokenService } from './TokenService';
import { UserService } from './UserService';

export class MeshyDb implements IMeshyDb {
  private constants: Constants;
  private userService: UserService;
  private tokenService: TokenService;

  constructor(clientKey: string, publicKey: string, tenant: string) {
    if (!clientKey) {
      throw new TypeError('Empty parameter: clientkey.');
    }

    if (!publicKey) {
      throw new TypeError('Empty parameter: publickey.');
    }

    if (!tenant) {
      throw new TypeError('Empty parameter: publickey.');
    }

    this.constants = new Constants(clientKey, publicKey, tenant);
    this.userService = new UserService(this.constants);
    this.tokenService = new TokenService(this.constants);
  }

  public login = (username: string, password: string) => {
    if (!username) {
      throw new TypeError('Missing required parameter: username');
    }

    if (!password) {
      throw new TypeError('Missing required parameter: password');
    }

    return new Promise<IMeshyDbClient>((resolve, reject) => {
      this.tokenService
        .generateAccessToken(username, password)
        .then(authId => {
          resolve(new MeshyDbClient(authId, this.constants, this.tokenService));
        })
        .catch(err => {
          reject(err);
        });
    });
  };

  public loginWithPersistance = (persistanceToken: string) => {
    if (!persistanceToken) {
      throw new TypeError('Missing required parameter: persistanceToken');
    }

    return new Promise<IMeshyDbClient>((resolve, reject) => {
      this.tokenService
        .generateAccessTokenWithRefreshToken(persistanceToken)
        .then(authId => {
          resolve(new MeshyDbClient(authId, this.constants, this.tokenService));
        })
        .catch(err => {
          reject(err);
        });
    });
  };

  public createUser = (newUser: INewUser) => {
    if (!newUser.username) {
      throw new TypeError('Missing required field: username');
    }

    if (!newUser.newPassword) {
      throw new TypeError('Missing required field: newPassword');
    }

    return this.userService.createUser(newUser);
  };

  public forgotPassword = (username: string) => {
    if (!username) {
      throw new TypeError('Missing required parameter: username');
    }

    const forgotPassword = new ForgotPassword();
    forgotPassword.username = username;

    return this.userService.forgotPassword(forgotPassword);
  };

  public resetPassword = (passwordResetHash: IPasswordResetHash, newPassword: string) => {
    if (!newPassword) {
      throw new TypeError('Missing required parameter: newPassword');
    }

    return this.userService.resetPassword(passwordResetHash, newPassword);
  };

  public loginAnonymously = (username?: string) => {
    const anonUser: INewUser = {
      firstName: null,
      id: '',
      isActive: true,
      lastName: null,
      newPassword: 'nopassword',
      phoneNumber: null,
      roles: [],
      username: username || guid(),
      verified: true,
    };

    return new Promise<IMeshyDbClient>((resolve, reject) => {
      this.userService
        .createUser(anonUser)
        .then(user => {
          if (user.username) {
            this.tokenService
              .generateAccessToken(user.username, 'nopassword')
              .then(authId => {
                resolve(new MeshyDbClient(authId, this.constants, this.tokenService));
              })
              .catch(err => {
                reject(err);
              });
          } else {
            reject('Missing required field: username');
          }
        })
        .catch(err => {
          reject(err);
        });
    });
  };
}
