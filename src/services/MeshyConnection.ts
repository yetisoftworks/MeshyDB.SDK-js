import { IMeshesService, IMeshyConnection, IUsersService } from '..';
import { Constants } from '../models/Constants';
import { MeshyRequest } from '../models/MeshyRequest';
import { UserPasswordUpdate } from '../models/UserPasswordUpdate';
import { MeshesService } from './MeshesService';
import { RequestService } from './RequestService';
import { TokenService } from './TokenService';
import { UsersService } from './UsersService';
import { Utils } from './Utils';

export class MeshyConnection implements IMeshyConnection {
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
    const updatePassword = new UserPasswordUpdate();
    updatePassword.previousPassword = previousPassword;
    updatePassword.newPassword = newPassword;
    return new Promise<void>((resolve, reject) => {
      const request = new MeshyRequest();
      request.authenticationId = this.authenticationId;
      request.data = updatePassword;
      request.path = 'users/me/password';
      request.method = RequestService.POST;

      this.requestService.sendRequest(request, Utils.configureCallback(resolve, reject));
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

      this.requestService.sendRequest(request, Utils.configureCallback(resolve, reject));
    });
  };
}
