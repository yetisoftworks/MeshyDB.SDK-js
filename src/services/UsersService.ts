import { IUser, IUsersService } from '..';
import { MeshyRequest } from '../models/MeshyRequest';
import { RequestService } from './RequestService';

export class UsersService implements IUsersService {
  private authenticationId: string;
  private requestService: RequestService;
  constructor(authId: string, requestService: RequestService) {
    this.authenticationId = authId;
    this.requestService = requestService;
  }
  public getSelf = () => {
    return new Promise<IUser>((resolve, reject) => {
      const request = new MeshyRequest();
      request.authenticationId = this.authenticationId;
      request.path = 'users/me';
      request.configureCallback(resolve, reject);

      this.requestService.sendRequest(request);
    });
  };
  public updateSelf = (user: IUser) => {
    return new Promise<IUser>((resolve, reject) => {
      const request = new MeshyRequest();
      request.authenticationId = this.authenticationId;
      request.path = 'users/me';
      request.configureCallback(resolve, reject);
      request.method = RequestService.PUT;
      request.data = user;

      this.requestService.sendRequest(request);
    });
  };
}
