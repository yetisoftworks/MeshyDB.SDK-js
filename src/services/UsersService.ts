import { Utils } from '.';
import { IUser, IUsersService } from '..';
import { MeshyRequest } from '../models/MeshyRequest';
import { IRequestService, RequestService } from './RequestService';

export class UsersService implements IUsersService {
  private authenticationId: string;
  private requestService: IRequestService;
  constructor(authId: string, requestService: IRequestService) {
    this.authenticationId = authId;
    this.requestService = requestService;
  }
  public getSelf = () => {
    return new Promise<IUser>((resolve, reject) => {
      const request = new MeshyRequest();
      request.authenticationId = this.authenticationId;
      request.path = 'users/me';

      this.requestService.sendRequest(request, Utils.configureCallback(resolve, reject));
    });
  };
  public updateSelf = (user: IUser) => {
    return new Promise<IUser>((resolve, reject) => {
      const request = new MeshyRequest();
      request.authenticationId = this.authenticationId;
      request.path = 'users/me';
      request.method = RequestService.PUT;
      request.data = user;

      this.requestService.sendRequest(request, Utils.configureCallback(resolve, reject));
    });
  };
}
