export class Constants {
  public apiUrl: string = '';
  public authUrl: string = '';
  public publicKey: string = '';
  public tenant: string | null | undefined = null;
  constructor(clientKey: string, publicKey: string, tenant?: string) {
    this.apiUrl = `https://api.meshydb.com/${clientKey}`;
    this.authUrl = `https://auth.meshydb.com/${clientKey}`;
    this.publicKey = publicKey;
    this.tenant = tenant;
  }
}
