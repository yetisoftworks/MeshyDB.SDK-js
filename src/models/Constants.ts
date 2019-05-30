export class Constants {
  public apiUrl: string = '';
  public authUrl: string = '';
  public publicKey: string = '';
  public tenant: string = '';
  constructor(clientKey: string, publicKey: string, tenant: string) {
    this.apiUrl = `http://localhost:59487/${clientKey}`;
    this.authUrl = `http://localhost:15333/${clientKey}`;
    this.publicKey = publicKey;
    this.tenant = tenant;
  }
}
