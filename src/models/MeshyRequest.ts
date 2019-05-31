import superagent from 'superagent';

export class MeshyRequest {
  public data: any = null;
  public path: string = '';
  public type: string | null = null;
  public authenticationId: string | null = null;
  public source: string = 'api';
  public method: string = 'GET';
  public queryData: any;
  public callback: (err: any, resp: superagent.Response) => void = () => {
    return;
  };
  public configureCallback = <T>(
    resolve: (value?: T | PromiseLike<T> | undefined) => void,
    reject: (reason?: any) => void,
  ) => {
    this.callback = (err: any, resp: superagent.Response) => {
      if (!resp.ok) {
        reject(err);
        return;
      }
      resolve(resp.body);
    };
  };
}
