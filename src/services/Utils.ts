import superagent from 'superagent';

export class Utils {
  public static ISO = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*))(?:Z|(\+|-)([\d|:]*))?$/;
  public static jsonReviver = (key: any, value: any) => {
    if (typeof value === 'string' && Utils.ISO.test(value)) {
      return new Date(value);
    }
    return value;
  };

  public static configureCallback = <T>(
    resolve: (value?: T | PromiseLike<T> | undefined) => void,
    reject: (reason?: any) => void,
  ) => {
    return (err: any, resp: superagent.Response) => {
      if (!resp.ok) {
        reject(err);
        return;
      }
      resolve(resp.body);
    };
  };
}
