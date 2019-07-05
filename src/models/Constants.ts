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

    // "AuthURITemplate": "http://localhost:15333/{tenant}",
    // "APIURITemplate": "http://localhost:59487/{tenant}",

    this.apiUrl = `http://localhost:59487/${accountName}`;
    this.authUrl = `http://localhost:15333/${accountName}`;
    this.publicKey = publicKey;
    this.tenant = tenant;
  }
}
