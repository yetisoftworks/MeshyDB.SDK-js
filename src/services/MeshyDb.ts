import { v4 as guid } from 'uuid';
import { MeshyDBClient, RequestService, TokenService, UserService } from '.';
import { IMeshyDB, IMeshyDBClient, IRegisterUser, IResetPassword, IUserVerificationCheck } from '..';
import { Constants, UserVerification } from '../models';
import { AnonymousRegistration } from '../models/AnonymousRegistration';

export class MeshyDB implements IMeshyDB {
  private constants: Constants;
  private userService: UserService;
  private tokenService: TokenService;
  private requestService: RequestService;
  constructor(clientKey: string, publicKey: string, tenant?: string) {
    if (!clientKey) {
      throw new TypeError('Empty parameter: clientkey.');
    }

    if (!publicKey) {
      throw new TypeError('Empty parameter: publickey.');
    }

    this.constants = new Constants(clientKey, publicKey, tenant);
    this.tokenService = new TokenService(this.constants);
    this.requestService = new RequestService(this.constants, this.tokenService);
    this.userService = new UserService(this.requestService);
  }

  public login = (username: string, password: string) => {
    if (!username) {
      throw new TypeError('Missing required parameter: username');
    }

    if (!password) {
      throw new TypeError('Missing required parameter: password');
    }

    return new Promise<IMeshyDBClient>((resolve, reject) => {
      this.tokenService
        .generateAccessToken(username, password)
        .then(authId => {
          resolve(new MeshyDBClient(authId, this.constants, this.tokenService));
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

    return new Promise<IMeshyDBClient>((resolve, reject) => {
      this.tokenService
        .generateAccessTokenWithRefreshToken(persistanceToken)
        .then(authId => {
          resolve(new MeshyDBClient(authId, this.constants, this.tokenService));
        })
        .catch(err => {
          reject(err);
        });
    });
  };

  public registerUser = (user: IRegisterUser) => {
    if (!user.username) {
      throw new TypeError('Missing required field: username');
    }

    if (!user.newPassword) {
      throw new TypeError('Missing required field: newPassword');
    }

    if (!user.phoneNumber) {
      throw new TypeError('Missing required field: phoneNumber');
    }

    return this.userService.registerUser(user);
  };

  public forgotPassword = (username: string) => {
    if (!username) {
      throw new TypeError('Missing required parameter: username');
    }

    const userVerification = new UserVerification();
    userVerification.username = username;

    return this.userService.forgotPassword(userVerification);
  };

  public resetPassword = (resetPassword: IResetPassword) => {
    if (!resetPassword.username) {
      throw new Error('Missing required field: username');
    }

    if (!resetPassword.hash) {
      throw new Error('Missing required field: hash');
    }

    if (!resetPassword.expires) {
      throw new Error('Missing required field: expires');
    }

    if (!resetPassword.verificationCode) {
      throw new Error('Missing required field: verificationCode');
    }

    if (!resetPassword.newPassword) {
      throw new TypeError('Missing required parameter: newPassword');
    }

    return this.userService.resetPassword(resetPassword);
  };

  public loginAnonymously = (username?: string) => {
    const anonUser = new AnonymousRegistration();
    anonUser.username = username || guid();

    return new Promise<IMeshyDBClient>((resolve, reject) => {
      this.userService
        .createAnonymousUser(anonUser)
        .then(user => {
          if (user.username) {
            this.tokenService
              .generateAccessToken(user.username, 'nopassword')
              .then(authId => {
                resolve(new MeshyDBClient(authId, this.constants, this.tokenService));
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

  public checkHash = (userVerificationCheck: IUserVerificationCheck) => {
    if (!userVerificationCheck.username) {
      throw new Error('Missing required field: username');
    }

    if (!userVerificationCheck.hash) {
      throw new Error('Missing required field: hash');
    }

    if (!userVerificationCheck.expires) {
      throw new Error('Missing required field: expires');
    }

    if (!userVerificationCheck.verificationCode) {
      throw new Error('Missing required field: verificationCode');
    }

    return new Promise<boolean>((resolve, reject) => {
      this.userService
        .checkHash(userVerificationCheck)
        .then(success => {
          resolve(success);
        })
        .catch(err => {
          reject(err);
        });
    });
  };

  public verifyUser = (userVerificationCheck: IUserVerificationCheck) => {
    if (!userVerificationCheck.username) {
      throw new Error('Missing required field: username');
    }

    if (!userVerificationCheck.hash) {
      throw new Error('Missing required field: hash');
    }

    if (!userVerificationCheck.expires) {
      throw new Error('Missing required field: expires');
    }

    if (!userVerificationCheck.verificationCode) {
      throw new Error('Missing required field: verificationCode');
    }

    return new Promise<void>((resolve, reject) => {
      this.userService
        .verify(userVerificationCheck)
        .then(_ => {
          resolve();
        })
        .catch(err => {
          reject(err);
        });
    });
  };
}
