import { IPasswordResetHash } from '..';

export class ResetPassword implements IPasswordResetHash {
  public username: string = '';
  public expires: Date = new Date();
  public hash: string = '';
  public newPassword: string = '';
}
