import { v4 as guid } from 'uuid';
import { INewUser, IPasswordResetHash } from "../../src";
import { ForgotPassword, MeshyRequest, ResetPassword } from "../../src/models";
import { IRequestService, UserService } from "../../src/services";
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
    } as INewUser;

    service.createUser(data).then(_ => {
        expect(true).toBeTruthy();
    });

    expect(passedRequest.authenticationId).toBeNull();
    expect(passedRequest.path).toBe("users");
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
    const data = new ForgotPassword();
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

    const service = new UserService(requestService);
    const data = {} as IPasswordResetHash;
    data.username = guid();
    data.expires = new Date();
    data.hash = guid();

    const newPassword = guid();

    const expectedData = new ResetPassword();
    expectedData.username = data.username;
    expectedData.expires = data.expires;
    expectedData.hash = data.hash;
    expectedData.newPassword = newPassword;

    service.resetPassword(data, newPassword).then(_ => {
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