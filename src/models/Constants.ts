import { Utils } from '../services/Utils';

export class Constants {
  public static canRestore() {
    const accountName = Utils.retrieveStorage<string>(Constants.accountStorageKey);
    const publicKey = Utils.retrieveStorage<string>(Constants.publicStorageKey);
    const tenant = Utils.retrieveStorage<string | undefined>(Constants.tenantStorageKey);

    return (accountName || publicKey || '').length > 0;
  }

  public static restore() {
    const accountName = Utils.retrieveStorage<string>(Constants.accountStorageKey);
    const publicKey = Utils.retrieveStorage<string>(Constants.publicStorageKey);
    const tenant = Utils.retrieveStorage<string | undefined>(Constants.tenantStorageKey);

    return new Constants(accountName || '', publicKey || '', tenant || '');
  }

  private static accountStorageKey = '_meshydb_accountname_';
  private static publicStorageKey = '_meshydb_publickey_';
  private static tenantStorageKey = '_meshydb_tenant_';

  public apiUrl: string = '';
  public authUrl: string = '';
  public publicKey: string = '';
  public tenant: string | null | undefined = null;
  public accountName: string = '';

  constructor(accountName: string, publicKey: string, tenant?: string) {
    if (!accountName) {
      throw new Error('Missing parameter: accountName');
    }

    if (!publicKey) {
      throw new Error('Missing parameter: publicKey');
    }

    this.apiUrl = `https://api.meshydb.com/${accountName}`;
    this.authUrl = `https://auth.meshydb.com/${accountName}`;
    this.accountName = accountName;
    this.publicKey = publicKey;
    this.tenant = tenant;
    this.save();
  }

  private save = () => {
    Utils.setStorage(Constants.accountStorageKey, this.accountName);
    Utils.setStorage(Constants.publicStorageKey, this.publicKey);
    Utils.setStorage(Constants.tenantStorageKey, this.tenant);
  };
}
