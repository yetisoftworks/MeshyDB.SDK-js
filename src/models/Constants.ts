export class Constants {
  public apiUrl: string = '';
  public authUrl: string = '';
  public publicKey: string = '';
  public tenant: string | null | undefined = null;
  constructor(clientKey: string, publicKey: string, tenant?: string) {
    if (!clientKey) {
      throw new Error('Missing parameter: clientKey');
    }

    if (!publicKey) {
      throw new Error('Missing parameter: publicKey');
    }

    this.apiUrl = `http://localhost:59487/${clientKey}`;
    this.authUrl = `http://localhost:15333/${clientKey}`;
    this.publicKey = publicKey;
    this.tenant = tenant;
  }
}
