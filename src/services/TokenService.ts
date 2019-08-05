import superagent from 'superagent';
import { v4 as guid } from 'uuid';
import { Constants } from '../models/Constants';
import { MeshyRequest } from '../models/MeshyRequest';
import { TokenCacheData } from '../models/TokenCacheData';
import { TokenRequest } from '../models/TokenRequest';
import { TokenResponse } from '../models/TokenResponse';
import { TokenRevocation } from '../models/TokenRevocation';
import { RequestService } from './RequestService';
import { Utils } from './Utils';

export class TokenService {
  public static wasSignedIn = () => {
    return !!Utils.retrieveStorage(TokenService.storageKey);
  };

  private static storageKey = '_meshydb_auth_';
  private constants: Constants;
  private requestService: RequestService;

  constructor(constants: Constants) {
    this.constants = constants;
    this.requestService = new RequestService(constants);
  }
  public generateAccessToken = (username: string, password: string) => {
    return new Promise<string>((resolve, reject) => {
      const data = new TokenRequest();
      data.client_id = this.constants.publicKey;
      data.username = username;
      data.password = password;

      const request = new MeshyRequest();
      request.method = RequestService.POST;
      request.source = RequestService.Auth;
      request.data = data;
      request.path = 'connect/token';
      request.type = RequestService.Form;
      const callback = (err: any, res: superagent.Response) => {
        if (!res.ok) {
          const respError = res as any;
          reject({
            error: err,
            response: respError.body,
            statusCode: respError.statusCode,
            statusText: respError.statusText,
          });
          return;
        }
        const authenticationId = guid();
        Utils.setStorage(TokenService.storageKey, this.convertToCacheData(res.body));
        resolve(authenticationId);
      };

      this.requestService.sendRequest(request, callback);
    });
  };
  public getAccessToken = (authenticationId: string) => {
    return new Promise<string | null>((resolve, reject) => {
      const data = Utils.retrieveStorage<TokenCacheData>(TokenService.storageKey);
      if (data) {
        if (data.expires > new Date()) {
          resolve(data.token);
        } else {
          const refreshData = new TokenRequest();
          refreshData.client_id = this.constants.publicKey;
          refreshData.grant_type = 'refresh_token';
          refreshData.refresh_token = data.refreshToken;

          const request = new MeshyRequest();
          request.method = RequestService.POST;
          request.source = RequestService.Auth;
          request.data = refreshData;
          request.path = 'connect/token';
          request.type = RequestService.Form;
          const callback = (err: any, res: superagent.Response) => {
            if (res.ok) {
              const respError = res as any;
              reject({
                error: err,
                response: respError.body,
                statusCode: respError.statusCode,
                statusText: respError.statusText,
              });

              return;
            }

            Utils.setStorage(TokenService.storageKey, this.convertToCacheData(res.body));
            resolve(res.body.token);
          };

          this.requestService.sendRequest(request, callback);
        }
      } else {
        resolve(null);
      }
    });
  };
  public generateAccessTokenWithRefreshToken = (refreshToken: string) => {
    return new Promise<string>((resolve, reject) => {
      const tokenRequest = new TokenRequest();
      tokenRequest.client_id = this.constants.publicKey;
      tokenRequest.grant_type = 'refresh_token';
      tokenRequest.refresh_token = refreshToken;

      const request = new MeshyRequest();
      request.method = RequestService.POST;
      request.source = RequestService.Auth;
      request.data = tokenRequest;
      request.path = 'connect/token';
      request.type = RequestService.Form;
      const callback = (err: any, res: superagent.Response) => {
        if (!res.ok) {
          const respError = res as any;
          reject({
            error: err,
            response: respError.body,
            statusCode: respError.statusCode,
            statusText: respError.statusText,
          });
          return;
        }
        const authId = guid();
        Utils.setStorage(TokenService.storageKey, this.convertToCacheData(res.body));

        resolve(authId);
      };

      this.requestService.sendRequest(request, callback);
    });
  };
  public getRefreshToken = (authenticationId: string) => {
    const cache = Utils.retrieveStorage<TokenCacheData>(TokenService.storageKey);
    if (cache) {
      return cache.refreshToken;
    }
    return null;
  };
  public signout = (authenticationId: string) => {
    return new Promise<void>((resolve, reject) => {
      const cache = Utils.retrieveStorage<TokenCacheData>(TokenService.storageKey);
      if (!cache) {
        return;
      }
      const revocation = new TokenRevocation();
      revocation.token = cache.refreshToken;
      revocation.token_type_hint = 'refresh_token';
      revocation.client_id = this.constants.publicKey;

      const request = new MeshyRequest();
      request.method = RequestService.POST;
      request.source = RequestService.Auth;
      request.data = revocation;
      request.path = 'connect/revocation';
      request.type = RequestService.Form;
      const callback = (err: any, res: superagent.Response) => {
        if (!res.ok) {
          const respError = res as any;
          reject({
            error: err,
            response: respError.body,
            statusCode: respError.statusCode,
            statusText: respError.statusText,
          });

          return;
        }
        Utils.deleteFromStorage(TokenService.storageKey);
        resolve();
      };

      this.requestService.sendRequest(request, callback);
    });
  };
  private convertToCacheData = (response: TokenResponse) => {
    const cache = new TokenCacheData();
    cache.token = response.access_token;
    cache.refreshToken = response.refresh_token;
    const expirationDate = new Date();
    cache.expires = new Date(expirationDate.setSeconds(expirationDate.getSeconds() + response.expires_in));
    return cache;
  };
}
