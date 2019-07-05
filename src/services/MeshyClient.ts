import { v4 as guid } from 'uuid';
import { IMeshyClient, IMeshyConnection, IRegisterUser, IResetPassword, IUserVerificationCheck } from '..';
import { AnonymousRegistration } from '../models/AnonymousRegistration';
import { Constants } from '../models/Constants';
import { UserVerification } from '../models/UserVerification';
import { MeshyConnection } from './MeshyConnection';
import { RequestService } from './RequestService';
import { TokenService } from './TokenService';
import { UserService } from './UserService';

export class MeshyClient implements IMeshyClient {
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
    return new Promise<IMeshyConnection>((resolve, reject) => {
      this.tokenService
        .generateAccessToken(username, password)
        .then(authId => {
          resolve(new MeshyConnection(authId, this.constants, this.tokenService));
        })
        .catch(err => {
          reject(err);
        });
    });
  };

  public loginWithPersistance = (persistanceToken: string) => {
    return new Promise<IMeshyConnection>((resolve, reject) => {
      this.tokenService
        .generateAccessTokenWithRefreshToken(persistanceToken)
        .then(authId => {
          resolve(new MeshyConnection(authId, this.constants, this.tokenService));
        })
        .catch(err => {
          reject(err);
        });
    });
  };

  public registerUser = (user: IRegisterUser) => {
    return this.userService.registerUser(user);
  };

  public forgotPassword = (username: string, attempt?: number) => {
    const userVerification = new UserVerification();
    userVerification.username = username;
    userVerification.attempt = attempt || 1;

    return this.userService.forgotPassword(userVerification);
  };

  public resetPassword = (resetPassword: IResetPassword) => {
    return this.userService.resetPassword(resetPassword);
  };

  public registerAnonymousUser = (username?: string) => {
    const anonUser = new AnonymousRegistration();
    anonUser.username = username || guid();
    return this.userService.createAnonymousUser(anonUser);
  };

  public loginAnonymously = (username: string) => {
    return new Promise<IMeshyConnection>((resolve, reject) => {
      this.tokenService
        .generateAccessToken(username, 'nopassword')
        .then(authId => {
          resolve(new MeshyConnection(authId, this.constants, this.tokenService));
        })
        .catch(err => {
          reject(err);
        });
    });
  };

  public checkHash = (userVerificationCheck: IUserVerificationCheck) => {
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
