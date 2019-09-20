import { IMeshData, IMeshesService, IPageResult } from '..';
import { MeshyRequest } from '../models/MeshyRequest';
import { IRequestService, RequestService } from './RequestService';
import { Utils } from './Utils';

export class MeshesService implements IMeshesService {
  private authenticationId: string;
  private requestService: IRequestService;
  constructor(authId: string, requestService: IRequestService) {
    this.authenticationId = authId;
    this.requestService = requestService;
  }
  public get = <T extends IMeshData>(meshName: string, id: string) => {
    return new Promise<T>((resolve, reject) => {
      const request = new MeshyRequest();
      request.authenticationId = this.authenticationId;
      request.path = `meshes/${meshName}/${id}`;

      this.requestService.sendRequest(request, Utils.configureCallback(resolve, reject));
    });
  };
  public search = <T extends IMeshData>(
    meshName: string,
    query?: {
      filter?: any;
      orderBy?: any;
      page?: number;
      pageSize?: number;
    },
  ) => {
    query = query || {
      page: 1,
      pageSize: 25,
    };
    query.page = query.page || 1;
    query.pageSize = query.pageSize || 25;
    return new Promise<IPageResult<T>>((resolve, reject) => {
      const request = new MeshyRequest();
      request.authenticationId = this.authenticationId;
      request.path = `meshes/${meshName}`;
      request.queryData = query;

      this.requestService.sendRequest(request, Utils.configureCallback(resolve, reject));
    });
  };
  public create = <T extends IMeshData>(meshName: string, data: T) => {
    return new Promise<T>((resolve, reject) => {
      const dataClone = JSON.parse(JSON.stringify(data), Utils.jsonReviver);
      delete dataClone._id;

      const request = new MeshyRequest();
      request.authenticationId = this.authenticationId;
      request.path = `meshes/${meshName}`;
      request.method = RequestService.POST;
      request.data = dataClone;

      this.requestService.sendRequest(request, Utils.configureCallback(resolve, reject));
    });
  };
  public update = <T extends IMeshData>(meshName: string, data: T, id?: string) => {
    return new Promise<T>((resolve, reject) => {
      id = id || data._id;

      if (!id) {
        throw new Error('Missing parameter: id');
      }

      const dataClone = JSON.parse(JSON.stringify(data), Utils.jsonReviver);
      delete dataClone._id;

      const request = new MeshyRequest();
      request.authenticationId = this.authenticationId;
      request.path = `meshes/${meshName}/${id}`;
      request.method = RequestService.PUT;
      request.data = dataClone;

      this.requestService.sendRequest(request, Utils.configureCallback(resolve, reject));
    });
  };
  public delete = (meshName: string, id: string) => {
    return new Promise<void>((resolve, reject) => {
      const request = new MeshyRequest();
      request.authenticationId = this.authenticationId;
      request.path = `meshes/${meshName}/${id}`;
      request.method = RequestService.DELETE;

      this.requestService.sendRequest(request, Utils.configureCallback(resolve, reject));
    });
  };
  public deleteCollection = (meshName: string) => {
    return new Promise<void>((resolve, reject) => {
      const request = new MeshyRequest();
      request.authenticationId = this.authenticationId;
      request.path = `meshes/${meshName}`;
      request.method = RequestService.DELETE;

      this.requestService.sendRequest(request, Utils.configureCallback(resolve, reject));
    });
  };
}
