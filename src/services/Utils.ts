import superagent from 'superagent';

export class Utils {
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
        const respError = resp as any;
        reject({
          error: err,
          response: respError.body,
          statusCode: respError.statusCode,
          statusText: respError.statusText,
        });
        return;
      }
      resolve(resp.body);
    };
  };
  public static setStorage = <T>(key: string, value: T) => {
    if (Utils.isBrowser) {
      sessionStorage[key] = JSON.stringify(value);
    } else {
      Utils.storage[key] = JSON.stringify(value);
    }
  };

  public static retrieveStorage = <T>(key: string): T | null => {
    const data = Utils.isBrowser ? sessionStorage[key] : Utils.storage[key];
    if (data && data !== 'undefined') {
      return JSON.parse(data, Utils.jsonReviver) as T;
    }
    return null;
  };

  public static deleteFromStorage = (key: string) => {
    if (Utils.isBrowser) {
      sessionStorage.removeItem(key);
    } else {
      delete Utils.storage[key];
    }
  };
  public static clearStorage = () => {
    if (Utils.isBrowser) {
      const keys = Object.keys(sessionStorage);

      if (keys) {
        for (const item of keys) {
          if (item.startsWith('_meshydb_')) {
            sessionStorage.removeItem(item);
          }
        }
      }
    } else {
      Utils.storage = {};
    }
  };

  private static ISO = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*))(?:Z|(\+|-)([\d|:]*))?$/;
  private static storage: any = {};

  private static get isBrowser() {
    return typeof window !== 'undefined' && typeof window.document !== 'undefined';
  }
}
