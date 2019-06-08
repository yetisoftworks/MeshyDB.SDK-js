import { v4 as guid } from 'uuid';
import { IRegisterUser, IResetPassword } from "../../src";
import { MeshyRequest } from '../../src/models/MeshyRequest';
import { UserVerification } from '../../src/models/UserVerification';
import { IRequestService } from '../../src/services/RequestService';
import { UserService } from '../../src/services/UserService';
import { RequestServiceMock } from "./mocks/RequestService.mock";

test("Should create UserService", () => {
    const service = new UserService(new RequestServiceMock());
    expect(service).toBeTruthy();
});

test("createUser should send proper request", () => {
    let passedRequest = {} as MeshyRequest;
    let passedCallback: any;

    const requestService: IRequestService = {
        sendRequest: (sentRequest: MeshyRequest, sentCallback: any) => {
            passedRequest = sentRequest;
            passedCallback = sentCallback;
        }
    }

    const service = new UserService(requestService);
    const data = {
        firstName: guid(),
        lastName: guid(),
        username: guid()
    } as IRegisterUser;

    service.registerUser(data).then(_ => {
        expect(true).toBeTruthy();
    });

    expect(passedRequest.authenticationId).toBeNull();
    expect(passedRequest.path).toBe("users/register");
    expect(passedRequest.source).toBe("api");
    expect(passedRequest.method).toBe("POST");
    expect(passedRequest.type).toBe(null);
    expect(passedRequest.data).toMatchObject(data);
    expect(passedRequest.queryData).toBe(null);
    passedCallback(null, { ok: true });
});

test("forgotPassword should send proper request", () => {
    let passedRequest = {} as MeshyRequest;
    let passedCallback: any;

    const requestService: IRequestService = {
        sendRequest: (sentRequest: MeshyRequest, sentCallback: any) => {
            passedRequest = sentRequest;
            passedCallback = sentCallback;
        }
    }

    const service = new UserService(requestService);
    const data = new UserVerification();
    data.username = guid();

    service.forgotPassword(data).then(_ => {
        expect(true).toBeTruthy();
    });

    expect(passedRequest.authenticationId).toBeNull();
    expect(passedRequest.path).toBe("users/forgotpassword");
    expect(passedRequest.source).toBe("api");
    expect(passedRequest.method).toBe("POST");
    expect(passedRequest.type).toBe(null);
    expect(passedRequest.data).toMatchObject(data);
    expect(passedRequest.queryData).toBe(null);
    passedCallback(null, { ok: true });
});

test("resetPassword should send proper request", () => {
    let passedRequest = {} as MeshyRequest;
    let passedCallback: any;

    const requestService: IRequestService = {
        sendRequest: (sentRequest: MeshyRequest, sentCallback: any) => {
            passedRequest = sentRequest;
            passedCallback = sentCallback;
        }
    }

    const newPassword = guid();

    const service = new UserService(requestService);
    const data = {} as IResetPassword;
    data.username = guid();
    data.expires = new Date();
    data.hash = guid();
    data.newPassword = newPassword;

    const expectedData = {} as IResetPassword;
    expectedData.username = data.username;
    expectedData.expires = data.expires;
    expectedData.hash = data.hash;
    expectedData.newPassword = newPassword;

    service.resetPassword(data).then(_ => {
        expect(true).toBeTruthy();
    });

    expect(passedRequest.authenticationId).toBeNull();
    expect(passedRequest.path).toBe("users/resetpassword");
    expect(passedRequest.source).toBe("api");
    expect(passedRequest.method).toBe("POST");
    expect(passedRequest.type).toBe(null);
    expect(passedRequest.data).toMatchObject(expectedData);
    expect(passedRequest.queryData).toBe(null);
    passedCallback(null, { ok: true });
});