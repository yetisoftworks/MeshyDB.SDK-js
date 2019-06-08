export class Constants {
  public apiUrl: string = '';
  public authUrl: string = '';
  public publicKey: string = '';
  public tenant: string | null | undefined = null;
  constructor(accountName: string, publicKey: string, tenant?: string) {
    if (!accountName) {
      throw new Error('Missing parameter: accountName');
    }

    if (!publicKey) {
      throw new Error('Missing parameter: publicKey');
    }

    this.apiUrl = `https://api.meshydb.com/${accountName}`;
    this.authUrl = `https://auth.meshydb.com/${accountName}`;
    this.publicKey = publicKey;
    this.tenant = tenant;
  }
}
