import { INewUser, IPageResult, ISecurityQuestionUpdate, IUser, IUsersService } from '..';
import { MeshyRequest } from '../models/MeshyRequest';
import { IRequestService, RequestService } from './RequestService';
import { Utils } from './Utils';

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
  public updateSecurityQuestion = (questionUpdate: ISecurityQuestionUpdate) => {
    return new Promise<void>((resolve, reject) => {
      const request = new MeshyRequest();
      request.authenticationId = this.authenticationId;
      request.path = 'users/me/questions';
      request.method = RequestService.POST;
      request.data = questionUpdate;

      this.requestService.sendRequest(request, Utils.configureCallback(resolve, reject));
    });
  };

  public get = (id: string): Promise<IUser> => {
    return new Promise<IUser>((resolve, reject) => {
      const request = new MeshyRequest();
      request.authenticationId = this.authenticationId;
      request.path = `users/${id}`;

      this.requestService.sendRequest(request, Utils.configureCallback(resolve, reject));
    });
  };
  public search = (
    query?:
      | {
          name?: string | undefined;
          orderBy?: any | undefined;
          activeOnly?: boolean | undefined;
          page?: number | undefined;
          pageSize?: number | undefined;
          roleId?: string | undefined;
        }
      | undefined,
  ): Promise<IPageResult<IUser>> => {
    return new Promise<IPageResult<IUser>>((resolve, reject) => {
      const request = new MeshyRequest();
      query = query || {
        page: 1,
        pageSize: 25,
      };

      query.page = query.page || 1;
      query.pageSize = query.pageSize || 25;

      request.authenticationId = this.authenticationId;
      request.path = `users`;
      request.queryData = query;

      this.requestService.sendRequest(request, Utils.configureCallback(resolve, reject));
    });
  };
  public create = (model: INewUser): Promise<IUser> => {
    return new Promise<IUser>((resolve, reject) => {
      const request = new MeshyRequest();
      request.authenticationId = this.authenticationId;
      request.path = `users`;
      request.data = model;
      request.method = RequestService.POST;

      this.requestService.sendRequest(request, Utils.configureCallback(resolve, reject));
    });
  };

  public update = (id: string, model: IUser): Promise<IUser> => {
    return new Promise<IUser>((resolve, reject) => {
      const request = new MeshyRequest();
      request.authenticationId = this.authenticationId;
      request.path = `users/${id}`;
      request.data = model;
      request.method = RequestService.PUT;

      this.requestService.sendRequest(request, Utils.configureCallback(resolve, reject));
    });
  };
  public delete = (id: string): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
      const request = new MeshyRequest();
      request.authenticationId = this.authenticationId;
      request.path = `users/${id}`;
      request.method = RequestService.DELETE;

      this.requestService.sendRequest(request, Utils.configureCallback(resolve, reject));
    });
  };
  public updateUserSecurityQuestion = (id: string, questionUpdate: ISecurityQuestionUpdate): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
      const request = new MeshyRequest();
      request.authenticationId = this.authenticationId;
      request.path = `users/${id}/questions`;
      request.data = questionUpdate;
      request.method = RequestService.POST;

      this.requestService.sendRequest(request, Utils.configureCallback(resolve, reject));
    });
  };
}
