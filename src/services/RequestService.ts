import superagent from 'superagent';
import { TokenService } from '.';
import { Constants, MeshyRequest } from '../models';

export class RequestService {
  public static Auth = 'auth';
  public static API = 'api';
  public static GET = 'GET';
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

  public sendRequest = (request: MeshyRequest) => {
    if (request.authenticationId && this.tokenService) {
      this.tokenService.getAccessToken(request.authenticationId).then(accessToken => {
        this.configureRequest(accessToken, request);
      });
    } else {
      this.configureRequest(null, request);
    }
  };

  private configureRequest = (token: string | null, request: MeshyRequest) => {
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
        requestConfig = requestConfig.query(`${key}=${encodeURIComponent(JSON.stringify(request.queryData[key]))}`);
      }
    }

    if (token) {
      requestConfig.set('Authorization', `Bearer ${token}`);
    }

    if (request.data) {
      requestConfig.send(request.data);
    }

    requestConfig.end(request.callback);
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

    return superagent.get(url);
  };
}
