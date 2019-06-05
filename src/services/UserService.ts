import { Utils } from '.';
import { IRegisterUser, IResetPassword, IUser, IUserVerificationCheck, IUserVerificationHash } from '..';
import { AnonymousRegistration } from '../models/AnonymousRegistration';
import { MeshyRequest } from '../models/MeshyRequest';
import { UserVerification } from '../models/UserVerification';
import { IRequestService, RequestService } from './RequestService';

export class UserService {
  private requestService: IRequestService;
  constructor(requestService: IRequestService) {
    this.requestService = requestService;
  }
  public registerUser = (user: IRegisterUser) => {
    return new Promise<IUserVerificationHash>((resolve, reject) => {
      const request = new MeshyRequest();
      request.path = `users/register`;
      request.method = RequestService.POST;
      request.data = user;

      this.requestService.sendRequest(request, Utils.configureCallback(resolve, reject));
    });
  };

  public createAnonymousUser = (user: AnonymousRegistration) => {
    return new Promise<IUser>((resolve, reject) => {
      const request = new MeshyRequest();
      request.path = `users/register/anonymous`;
      request.method = RequestService.POST;
      request.data = user;

      this.requestService.sendRequest(request, Utils.configureCallback(resolve, reject));
    });
  };

  public forgotPassword = (userVerification: UserVerification) => {
    return new Promise<IUserVerificationHash>((resolve, reject) => {
      const request = new MeshyRequest();
      request.path = `users/forgotpassword`;
      request.method = RequestService.POST;
      request.data = userVerification;

      this.requestService.sendRequest(request, Utils.configureCallback(resolve, reject));
    });
  };
  public resetPassword = (resetPassword: IResetPassword) => {
    return new Promise<void>((resolve, reject) => {
      const request = new MeshyRequest();
      request.path = `users/resetpassword`;
      request.method = RequestService.POST;
      request.data = resetPassword;

      this.requestService.sendRequest(request, Utils.configureCallback(resolve, reject));
    });
  };
  public checkHash(userVerificationCheck: IUserVerificationCheck) {
    return new Promise<boolean>((resolve, reject) => {
      const request = new MeshyRequest();
      request.path = `users/checkhash`;
      request.method = RequestService.POST;
      request.data = userVerificationCheck;

      this.requestService.sendRequest(request, Utils.configureCallback(resolve, reject));
    });
  }

  public verify(userVerificationCheck: IUserVerificationCheck) {
    return new Promise<void>((resolve, reject) => {
      const request = new MeshyRequest();
      request.path = `users/verify`;
      request.method = RequestService.POST;
      request.data = userVerificationCheck;

      this.requestService.sendRequest(request, Utils.configureCallback(resolve, reject));
    });
  }
}
