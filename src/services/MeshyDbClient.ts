import { MeshesService, RequestService, TokenService, UsersService } from '.';
import { IMeshesService, IMeshyDBClient, IUsersService } from '..';
import { Constants, MeshyRequest, UserPasswordUpdate } from '../models';

export class MeshyDBClient implements IMeshyDBClient {
  public usersService: IUsersService;
  public meshesService: IMeshesService;
  private authenticationId: string;
  private tokenService: TokenService;
  private requestService: RequestService;
  constructor(authenticationId: string, constants: Constants, tokenService: TokenService) {
    this.authenticationId = authenticationId;
    this.tokenService = tokenService;
    this.requestService = new RequestService(constants, this.tokenService);
    this.usersService = new UsersService(authenticationId, this.requestService);
    this.meshesService = new MeshesService(authenticationId, this.requestService);
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
      const request = new MeshyRequest();
      request.authenticationId = this.authenticationId;
      request.data = updatePassword;
      request.path = 'users/me/password';
      request.method = RequestService.POST;
      request.configureCallback(resolve, reject);

      this.requestService.sendRequest(request);
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
      const request = new MeshyRequest();
      request.authenticationId = this.authenticationId;
      request.path = 'connect/userinfo';
      request.source = RequestService.Auth;
      request.configureCallback(resolve, reject);

      this.requestService.sendRequest(request);
    });
  };
}
