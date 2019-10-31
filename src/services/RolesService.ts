import { IBatchRoleAdd, IBatchRoleRemove, IPageResult, IPermissible, IPermission, IRole, IRolesService } from '..';
import { MeshyRequest } from '../models/MeshyRequest';
import { IRequestService, RequestService } from './RequestService';
import { Utils } from './Utils';

export class RolesService implements IRolesService {
  private authenticationId: string;
  private requestService: IRequestService;

  constructor(authId: string, requestService: IRequestService) {
    this.authenticationId = authId;
    this.requestService = requestService;
  }

  public get = (id: string): Promise<IRole> => {
    return new Promise<IRole>((resolve, reject) => {
      const request = new MeshyRequest();
      request.authenticationId = this.authenticationId;
      request.path = `roles/${id}`;

      this.requestService.sendRequest(request, Utils.configureCallback(resolve, reject));
    });
  };
  public search = (
    query?: { name?: string | undefined; page?: number | undefined; pageSize?: number | undefined } | undefined,
  ): Promise<IPageResult<IRole>> => {
    return new Promise<IPageResult<IRole>>((resolve, reject) => {
      query = query || {
        page: 1,
        pageSize: 25,
      };

      query.page = query.page || 1;
      query.pageSize = query.pageSize || 25;

      const request = new MeshyRequest();
      request.authenticationId = this.authenticationId;
      request.path = `roles`;
      request.queryData = query;

      this.requestService.sendRequest(request, Utils.configureCallback(resolve, reject));
    });
  };
  public create = (model: IRole): Promise<IRole> => {
    return new Promise<IRole>((resolve, reject) => {
      const request = new MeshyRequest();
      request.authenticationId = this.authenticationId;
      request.path = `roles`;
      request.data = model;
      request.method = RequestService.POST;

      this.requestService.sendRequest(request, Utils.configureCallback(resolve, reject));
    });
  };
  public update = (id: string, model: IRole): Promise<IRole> => {
    return new Promise<IRole>((resolve, reject) => {
      const request = new MeshyRequest();
      request.authenticationId = this.authenticationId;
      request.path = `roles/${id}`;
      request.data = model;
      request.method = RequestService.PUT;

      this.requestService.sendRequest(request, Utils.configureCallback(resolve, reject));
    });
  };
  public delete = (id: string): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
      const request = new MeshyRequest();
      request.authenticationId = this.authenticationId;
      request.path = `roles/${id}`;
      request.method = RequestService.DELETE;

      this.requestService.sendRequest(request, Utils.configureCallback(resolve, reject));
    });
  };
  public getPermission = (roleId: string, permissionId: string): Promise<IPermission> => {
    return new Promise<IPermission>((resolve, reject) => {
      const request = new MeshyRequest();
      request.authenticationId = this.authenticationId;
      request.path = `roles/${roleId}/permissions/${permissionId}`;

      this.requestService.sendRequest(request, Utils.configureCallback(resolve, reject));
    });
  };
  public searchPermission = (
    roleId: string,
    query?:
      | { permissibleName?: string | undefined; page?: number | undefined; pageSize?: number | undefined }
      | undefined,
  ): Promise<IPageResult<IPermission>> => {
    return new Promise<IPageResult<IPermission>>((resolve, reject) => {
      query = query || {
        page: 1,
        pageSize: 25,
      };

      query.page = query.page || 1;
      query.pageSize = query.pageSize || 25;

      const request = new MeshyRequest();
      request.authenticationId = this.authenticationId;
      request.path = `roles/${roleId}/permissions`;
      request.queryData = query;

      this.requestService.sendRequest(request, Utils.configureCallback(resolve, reject));
    });
  };
  public createPermission = (roleId: string, model: IPermission): Promise<IPermission> => {
    return new Promise<IPermission>((resolve, reject) => {
      const request = new MeshyRequest();
      request.authenticationId = this.authenticationId;
      request.path = `roles/${roleId}/permissions`;
      request.data = model;
      request.method = RequestService.POST;

      this.requestService.sendRequest(request, Utils.configureCallback(resolve, reject));
    });
  };
  public updatePermission = (roleId: string, permissionId: string, model: IPermission): Promise<IPermission> => {
    return new Promise<IPermission>((resolve, reject) => {
      const request = new MeshyRequest();
      request.authenticationId = this.authenticationId;
      request.path = `roles/${roleId}/permissions/${permissionId}`;
      request.data = model;
      request.method = RequestService.PUT;

      this.requestService.sendRequest(request, Utils.configureCallback(resolve, reject));
    });
  };
  public deletePermission = (roleId: string, permissionId: string): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
      const request = new MeshyRequest();
      request.authenticationId = this.authenticationId;
      request.path = `roles/${roleId}/permissions/${permissionId}`;
      request.method = RequestService.DELETE;

      this.requestService.sendRequest(request, Utils.configureCallback(resolve, reject));
    });
  };
  public searchPermissible = (
    query?: { name?: string | undefined; page?: number | undefined; pageSize?: number | undefined } | undefined,
  ): Promise<IPageResult<IPermissible>> => {
    return new Promise<IPageResult<IPermissible>>((resolve, reject) => {
      query = query || {
        page: 1,
        pageSize: 25,
      };

      query.page = query.page || 1;
      query.pageSize = query.pageSize || 25;

      const request = new MeshyRequest();
      request.authenticationId = this.authenticationId;
      request.path = `permissibles`;
      request.queryData = query;

      this.requestService.sendRequest(request, Utils.configureCallback(resolve, reject));
    });
  };
  public addUsers = (id: string, model: IBatchRoleAdd): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
      const request = new MeshyRequest();
      request.authenticationId = this.authenticationId;
      request.path = `roles/${id}/users`;
      request.method = RequestService.POST;
      request.data = model;

      this.requestService.sendRequest(request, Utils.configureCallback(resolve, reject));
    });
  };
  public removeUsers = (id: string, model: IBatchRoleRemove): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
      const request = new MeshyRequest();
      request.authenticationId = this.authenticationId;
      request.path = `roles/${id}/users`;
      request.method = RequestService.DELETE;
      request.data = model;

      this.requestService.sendRequest(request, Utils.configureCallback(resolve, reject));
    });
  };
}
