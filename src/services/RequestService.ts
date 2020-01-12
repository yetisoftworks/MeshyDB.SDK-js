import superagent from 'superagent';
import { Constants } from '../models/Constants';
import { MeshyRequest } from '../models/MeshyRequest';
import { TokenService } from './TokenService';

export class RequestService implements IRequestService {
  public static Auth = 'auth';
  public static API = 'api';
  public static GET = 'GET';
  public static PATCH = 'PATCH';
  public static POST = 'POST';
  public static PUT = 'PUT';
  public static DELETE = 'DELETE';
  public static Form = 'form';

  private constants: Constants;
  private tokenService: TokenService | undefined;

  constructor(constants: Constants, tokenService?: TokenService) {
    this.constants = constants;
    this.tokenService = tokenService;
  }

  public sendRequest = (request: MeshyRequest, callback: (err: any, resp: superagent.Response) => void) => {
    if (request.authenticationId && this.tokenService) {
      this.tokenService.getAccessToken(request.authenticationId).then(accessToken => {
        this.configureRequest(accessToken, request, callback);
      });
    } else {
      this.configureRequest(null, request, callback);
    }
  };

  private configureRequest = (
    token: string | null,
    request: MeshyRequest,
    callback: (err: any, resp: superagent.Response) => void,
  ) => {
    let url: string = '';

    if (request.source === RequestService.API) {
      url = `${this.constants.apiUrl}/${request.path}`;
    } else {
      url = `${this.constants.authUrl}/${request.path}`;
    }

    let requestConfig = this.getRequestMethod(url, request.method);

    if (this.constants.tenant) {
      requestConfig.set('tenant', this.constants.tenant);
    }

    if (request.type) {
      requestConfig.type(request.type);
    }

    if (request.queryData) {
      for (const key of Object.keys(request.queryData)) {
        let queryData = request.queryData[key];
        if (typeof queryData !== 'string') {
          queryData = JSON.stringify(request.queryData[key]);
        }

        requestConfig = requestConfig.query(`${key}=${encodeURIComponent(queryData)}`);
      }
    }

    if (token) {
      requestConfig.set('Authorization', `Bearer ${token}`);
    }

    if (request.data) {
      requestConfig.send(request.data);
    }

    requestConfig.end(callback);
  };

  private getRequestMethod = (url: string, method: string) => {
    if (method === RequestService.PUT) {
      return superagent.put(url);
    }

    if (method === RequestService.POST) {
      return superagent.post(url);
    }

    if (method === RequestService.DELETE) {
      return superagent.delete(url);
    }

    if (method === RequestService.PATCH) {
      return superagent.patch(url);
    }

    return superagent.get(url);
  };
}

export interface IRequestService {
  sendRequest(request: MeshyRequest, callback: (err: any, resp: superagent.Response) => void): void;
}
