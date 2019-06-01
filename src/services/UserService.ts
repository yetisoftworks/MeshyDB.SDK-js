import { Utils } from '.';
import { INewUser, IPasswordResetHash, IUser } from '..';
import { ForgotPassword } from '../models/ForgotPassword';
import { MeshyRequest } from '../models/MeshyRequest';
import { ResetPassword } from '../models/ResetPassword';
import { IRequestService, RequestService } from './RequestService';

export class UserService {
  private requestService: IRequestService;
  constructor(requestService: IRequestService) {
    this.requestService = requestService;
  }
  public createUser = (newUser: INewUser) => {
    return new Promise<IUser>((resolve, reject) => {
      const request = new MeshyRequest();
      request.path = `users`;
      request.method = RequestService.POST;
      request.data = newUser;

      this.requestService.sendRequest(request, Utils.configureCallback(resolve, reject));
    });
  };
  public forgotPassword = (forgotPassword: ForgotPassword) => {
    return new Promise<IPasswordResetHash>((resolve, reject) => {
      const request = new MeshyRequest();
      request.path = `users/forgotpassword`;
      request.method = RequestService.POST;
      request.data = forgotPassword;

      this.requestService.sendRequest(request, Utils.configureCallback(resolve, reject));
    });
  };
  public resetPassword = (passwordResetHash: IPasswordResetHash, newPassword: string) => {
    return new Promise<void>((resolve, reject) => {
      const passwordReset = new ResetPassword();
      passwordReset.expires = passwordResetHash.expires;
      passwordReset.hash = passwordResetHash.hash;
      passwordReset.username = passwordResetHash.username;
      passwordReset.newPassword = newPassword;

      const request = new MeshyRequest();
      request.path = `users/resetpassword`;
      request.method = RequestService.POST;
      request.data = passwordReset;

      this.requestService.sendRequest(request, Utils.configureCallback(resolve, reject));
    });
  };
}
