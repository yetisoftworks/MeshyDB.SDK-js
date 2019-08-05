import { v4 as guid } from 'uuid';
import {
  IExist,
  IMeshyClient,
  IMeshyConnection,
  IRegisterUser,
  IResetPassword,
  IUserVerificationCheck,
  IValid,
} from '..';
import { AnonymousRegistration } from '../models/AnonymousRegistration';
import { Constants } from '../models/Constants';
import { UserVerification } from '../models/UserVerification';
import { MeshyConnection } from './MeshyConnection';
import { RequestService } from './RequestService';
import { TokenService } from './TokenService';
import { UserService } from './UserService';
import { Utils } from './Utils';

export class MeshyClient implements IMeshyClient {
  public static set currentConnection(value) {
    MeshyClient._currentConnection = value;
  }

  public static get currentConnection() {
    if (!this._currentConnection && TokenService.wasSignedIn()) {
      const constants = Constants.restore();
      const client = new MeshyClient(constants.accountName, constants.publicKey, constants.tenant || '');
      client.restoreSession();
    }

    return this._currentConnection;
  }

  private static _currentConnection: IMeshyConnection | null;

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
    if (MeshyClient.currentConnection) {
      throw new Error('Connection has already been established. Please sign out before switching');
    }

    return new Promise<IMeshyConnection>((resolve, reject) => {
      this.tokenService
        .generateAccessToken(username, password)
        .then(authId => {
          MeshyClient.currentConnection = new MeshyConnection(authId, this.constants, this.tokenService);
          resolve(MeshyClient.currentConnection);
        })
        .catch(err => {
          reject(err);
        });
    });
  };

  public loginWithRefresh = (refreshToken: string) => {
    if (MeshyClient.currentConnection) {
      throw new Error('Connection has already been established. Please sign out before switching');
    }

    return new Promise<IMeshyConnection>((resolve, reject) => {
      this.tokenService
        .generateAccessTokenWithRefreshToken(refreshToken)
        .then(authId => {
          MeshyClient.currentConnection = new MeshyConnection(authId, this.constants, this.tokenService);

          resolve(MeshyClient.currentConnection);
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
    if (MeshyClient.currentConnection) {
      throw new Error('Connection has already been established. Please sign out before switching');
    }

    return new Promise<IMeshyConnection>((resolve, reject) => {
      this.tokenService
        .generateAccessToken(username, 'nopassword')
        .then(authId => {
          MeshyClient.currentConnection = new MeshyConnection(authId, this.constants, this.tokenService);

          resolve(MeshyClient.currentConnection);
        })
        .catch(err => {
          reject(err);
        });
    });
  };

  public checkHash = (userVerificationCheck: IUserVerificationCheck) => {
    return new Promise<IValid>((resolve, reject) => {
      this.userService
        .checkHash(userVerificationCheck)
        .then(valid => {
          resolve(valid);
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

  public checkUserExist = (username: string) => {
    return new Promise<IExist>((resolve, reject) => {
      this.userService
        .checkUserExist(username)
        .then(exists => {
          resolve(exists);
        })
        .catch(err => {
          reject(err);
        });
    });
  };

  private restoreSession = () => {
    const authId = Utils.retrieveStorage<string>('_meshydb_authid_');
    MeshyClient.currentConnection = new MeshyConnection(authId || '', this.constants, this.tokenService);
  };
}
