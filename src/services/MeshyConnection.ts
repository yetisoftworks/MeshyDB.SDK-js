import { ICurrentUser, IMeshesService, IMeshyConnection, IProjectionsService, IRolesService, IUsersService } from '..';
import { Constants } from '../models/Constants';
import { MeshyRequest } from '../models/MeshyRequest';
import { UserPasswordUpdate } from '../models/UserPasswordUpdate';
import { MeshesService } from './MeshesService';
import { MeshyClient } from './MeshyClient';
import { ProjectionsService } from './ProjectionsService';
import { RequestService } from './RequestService';
import { RolesService } from './RolesService';
import { TokenService } from './TokenService';
import { UsersService } from './UsersService';
import { Utils } from './Utils';

export class MeshyConnection implements IMeshyConnection {
  set currentUser(value) {
    this._currentUser = value;
  }

  get currentUser() {
    if (this._currentUser) {
      return this._currentUser;
    }

    if (MeshyClient.currentConnection) {
      const accessToken = this.tokenService.retrieveAccessToken();
      if (accessToken) {
        const parsedToken = this.parseJwt(accessToken);

        this._currentUser = {
          firstName: parsedToken[this.claimNames.given_name] || '',
          id: parsedToken[this.claimNames.sub] || '',
          lastName: parsedToken[this.claimNames.family_name] || '',
          permissions: parsedToken[this.claimNames.permission] || [],
          roles: parsedToken[this.claimNames.role] || [],
          username: parsedToken[this.claimNames.id] || '',
        } as ICurrentUser;
      }

      return this._currentUser;
    }

    return null;
  }

  public usersService: IUsersService;
  public meshesService: IMeshesService;
  public projectionsService: IProjectionsService;
  public rolesService: IRolesService;

  private set authenticationId(value: string) {
    Utils.setStorage('_meshydb_authid_', value);
  }

  private get authenticationId() {
    return Utils.retrieveStorage('_meshydb_authid_') || '';
  }

  private tokenService: TokenService;
  private requestService: RequestService;
  private _currentUser: ICurrentUser | null = null;
  private claimNames = {
    family_name: 'family_name',
    given_name: 'given_name',
    id: 'id',
    permission: 'permission',
    role: 'role',
    sub: 'sub',
  };

  constructor(authenticationId: string, constants: Constants, tokenService: TokenService) {
    this.authenticationId = authenticationId;
    this.tokenService = tokenService;
    this.requestService = new RequestService(constants, this.tokenService);
    this.usersService = new UsersService(authenticationId, this.requestService);
    this.meshesService = new MeshesService(authenticationId, this.requestService);
    this.projectionsService = new ProjectionsService(authenticationId, this.requestService);
    this.rolesService = new RolesService(authenticationId, this.requestService);
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
    MeshyClient.currentConnection = null;
    Utils.clearStorage();

    return this.tokenService.signout(this.authenticationId);
  };
  public retrieveRefreshToken = () => {
    return this.tokenService.getRefreshToken(this.authenticationId);
  };
  private parseJwt = (token: string) => {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join(''),
    );

    return JSON.parse(jsonPayload);
  };
}
