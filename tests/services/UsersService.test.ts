import { v4 as guid } from 'uuid';
import { IUser } from "../../src";
import { MeshyRequest } from "../../src/models";
import { IRequestService, UsersService } from "../../src/services";
import { RequestServiceMock } from "./mocks/RequestService.mock";

test("Should create UsersService", () => {
    const service = new UsersService(guid(), new RequestServiceMock());
    expect(service).toBeTruthy();
});

test("getSelf should send proper request", () => {
    let passedRequest = {} as MeshyRequest;
    let passedCallback: any;

    const requestService: IRequestService = {
        sendRequest: (sentRequest: MeshyRequest, sentCallback: any) => {
            passedRequest = sentRequest;
            passedCallback = sentCallback;
        }
    }

    const authId = guid();

    const service = new UsersService(authId, requestService);

    service.getSelf().then(_=>{
        expect(true).toBeTruthy();
    });

    expect(passedRequest.authenticationId).toBe(authId);
    expect(passedRequest.path).toBe("users/me");
    expect(passedRequest.source).toBe("api");
    expect(passedRequest.method).toBe("GET");
    expect(passedRequest.type).toBe(null);
    expect(passedRequest.data).toBe(null);
    expect(passedRequest.queryData).toBe(null);
    passedCallback(null, { ok: true });
});

test("updateSelf should send proper request", () => {
    let passedRequest = {} as MeshyRequest;
    let passedCallback: any;

    const requestService: IRequestService = {
        sendRequest: (sentRequest: MeshyRequest, sentCallback: any) => {
            passedRequest = sentRequest;
            passedCallback = sentCallback;
        }
    }

    const authId = guid();

    const service = new UsersService(authId, requestService);
    const data = {} as IUser;
    service.updateSelf(data).then(_=>{
        expect(true).toBeTruthy();
    });

    expect(passedRequest.authenticationId).toBe(authId);
    expect(passedRequest.path).toBe("users/me");
    expect(passedRequest.source).toBe("api");
    expect(passedRequest.method).toBe("PUT");
    expect(passedRequest.type).toBe(null);
    expect(passedRequest.data).toMatchObject(data);
    expect(passedRequest.queryData).toBe(null);
    passedCallback(null, { ok: true });
});