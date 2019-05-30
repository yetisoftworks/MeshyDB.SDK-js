import * as superagent from 'superagent';
import { IMeshData, IMeshesService, PageResult } from '..';
import { Constants } from '../models/Constants';
import { TokenService } from './TokenService';
import { Utils } from './Utils';

export class MeshesService implements IMeshesService {
  private authenticationId: string;
  private constants: Constants;
  private tokenService: TokenService;
  constructor(authId: string, constants: Constants, tokenService: TokenService) {
    this.authenticationId = authId;
    this.constants = constants;
    this.tokenService = tokenService;
  }
  public get = <T extends IMeshData>(meshName: string, id: string) => {
    return new Promise<T>((resolve, reject) => {
      this.tokenService.getAccessToken(this.authenticationId).then(accessToken => {
        superagent
          .get(`${this.constants.apiUrl}/meshes/${meshName}/${id}`)
          .set('tenant', this.constants.tenant)
          .set('Authorization', `Bearer ${accessToken}`)
          .end((err, resp) => {
            if (!resp.ok) {
              reject(err);
              return;
            }
            resolve(resp.body);
          });
      });
    });
  };
  public search = <T extends IMeshData>(
    meshName: string,
    query: {
      filter: any;
      orderby: any;
      pageNumber: number;
      pageSize: number;
    },
  ) => {
    query = query || {
      filter: null,
      orderby: null,
      pageNumber: 1,
      pageSize: 1,
    };
    query.pageNumber = query.pageNumber || 1;
    query.pageSize = query.pageSize || 25;
    return new Promise<PageResult<T>>((resolve, reject) => {
      this.tokenService.getAccessToken(this.authenticationId).then(accessToken => {
        let request = superagent
          .get(`${this.constants.apiUrl}/meshes/${meshName}`)
          .set('tenant', this.constants.tenant)
          .set('Authorization', `Bearer ${accessToken}`);
        const queryData: any = query;
        if (queryData) {
          for (const key of Object.keys(queryData)) {
            request = request.query(`${key}=${encodeURIComponent(JSON.stringify(queryData[key]))}`);
          }
        }
        request.end((err, resp) => {
          if (!resp.ok) {
            reject(err);
            return;
          }
          resolve(resp.body);
        });
      });
    });
  };
  public create = <T extends IMeshData>(meshName: string, data: T) => {
    return new Promise<T>((resolve, reject) => {
      this.tokenService.getAccessToken(this.authenticationId).then(accessToken => {
        const dataClone = JSON.parse(JSON.stringify(data), Utils.jsonReviver);
        delete dataClone._id;
        superagent
          .post(`${this.constants.apiUrl}/meshes/${meshName}`)
          .set('tenant', this.constants.tenant)
          .set('Authorization', `Bearer ${accessToken}`)
          .send(dataClone)
          .end((err, resp) => {
            if (!resp.ok) {
              reject(err);
              return;
            }
            resolve(resp.body);
          });
      });
    });
  };
  public update = <T extends IMeshData>(meshName: string, data: T, id?: string) => {
    return new Promise<T>((resolve, reject) => {
      this.tokenService.getAccessToken(this.authenticationId).then(accessToken => {
        id = id || data._id;
        const dataClone = JSON.parse(JSON.stringify(data), Utils.jsonReviver);
        delete dataClone._id;
        superagent
          .put(`${this.constants.apiUrl}/meshes/${meshName}/${id}`)
          .set('tenant', this.constants.tenant)
          .set('Authorization', `Bearer ${accessToken}`)
          .send(dataClone)
          .end((err, resp) => {
            if (!resp.ok) {
              reject(err);
              return;
            }
            resolve(resp.body);
          });
      });
    });
  };
  public delete = (meshName: string, id: string) => {
    return new Promise<void>((resolve, reject) => {
      this.tokenService.getAccessToken(this.authenticationId).then(accessToken => {
        superagent
          .delete(`${this.constants.apiUrl}/meshes/${meshName}/${id}`)
          .set('tenant', this.constants.tenant)
          .set('Authorization', `Bearer ${accessToken}`)
          .end((err, resp) => {
            if (!resp.ok) {
              reject(err);
              return;
            }
            resolve();
          });
      });
    });
  };
  public deleteCollection = (meshName: string) => {
    return new Promise<void>((resolve, reject) => {
      this.tokenService.getAccessToken(this.authenticationId).then(accessToken => {
        superagent
          .delete(`${this.constants.apiUrl}/meshes/${meshName}`)
          .set('tenant', this.constants.tenant)
          .set('Authorization', `Bearer ${accessToken}`)
          .end((err, resp) => {
            if (!resp.ok) {
              reject(err);
              return;
            }
            resolve();
          });
      });
    });
  };
}
