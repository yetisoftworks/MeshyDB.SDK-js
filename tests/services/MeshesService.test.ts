import { v4 as guid } from 'uuid';
import { MeshyRequest } from "../../src/models";
import { IRequestService, MeshesService } from "../../src/services";
import { MeshDataMock } from "./mocks/MeshData.mock";
import { RequestServiceMock } from "./mocks/RequestService.mock";

test("Should create MeshesService", () => {
    const service = new MeshesService(guid(), new RequestServiceMock());
    expect(service).toBeTruthy();
});

test("get should send proper request", () => {
    let passedRequest = {} as MeshyRequest;
    let passedCallback: any;

    const requestService: IRequestService = {
        sendRequest: (sentRequest: MeshyRequest, sentCallback: any) => {
            passedRequest = sentRequest;
            passedCallback = sentCallback;
        }
    }
    const authId = guid();
    const service = new MeshesService(authId, requestService);
    const meshName = guid();
    const meshId = guid();
    service.get(meshName, meshId).then(_ => {
        expect(true).toBeTruthy();
    });

    expect(passedRequest.authenticationId).toBe(authId);
    expect(passedRequest.path).toBe(`meshes/${meshName}/${meshId}`);
    expect(passedRequest.source).toBe("api");
    expect(passedRequest.method).toBe("GET");
    expect(passedRequest.type).toBe(null);
    expect(passedRequest.data).toBeNull();
    expect(passedRequest.queryData).toBe(null);
    passedCallback(null, { ok: true });
});

test("search should send proper request", () => {
    let passedRequest = {} as MeshyRequest;
    let passedCallback: any;

    const requestService: IRequestService = {
        sendRequest: (sentRequest: MeshyRequest, sentCallback: any) => {
            passedRequest = sentRequest;
            passedCallback = sentCallback;
        }
    }
    const authId = guid();
    const service = new MeshesService(authId, requestService);
    const meshName = guid();
    const queryData = {
        filter: { data: 5 },
        orderby: { data: -1 },
        pageNumber: 1,
        pageSize: 1
    };

    service.search(meshName, queryData).then(_ => {
        expect(true).toBeTruthy();
    });

    expect(passedRequest.authenticationId).toBe(authId);
    expect(passedRequest.path).toBe(`meshes/${meshName}`);
    expect(passedRequest.source).toBe("api");
    expect(passedRequest.method).toBe("GET");
    expect(passedRequest.type).toBeNull();
    expect(passedRequest.data).toBeNull();
    expect(passedRequest.queryData).toMatchObject(queryData);
    passedCallback(null, { ok: true });
});

test("search should set page number to 1 when set to 0", () => {
    let passedRequest = {} as MeshyRequest;
    let passedCallback: any;

    const requestService: IRequestService = {
        sendRequest: (sentRequest: MeshyRequest, sentCallback: any) => {
            passedRequest = sentRequest;
            passedCallback = sentCallback;
        }
    }
    const authId = guid();
    const service = new MeshesService(authId, requestService);
    const meshName = guid();
    const queryData = {
        filter: { data: 5 },
        orderby: { data: -1 },
        pageNumber: 0,
        pageSize: 1
    };

    service.search(meshName, queryData).then(_ => {
        expect(true).toBeTruthy();
    });

    expect(passedRequest.queryData.pageNumber).toBe(1);
});

test("search should set page size to 25 when set to 0", () => {
    let passedRequest = {} as MeshyRequest;
    let passedCallback: any;

    const requestService: IRequestService = {
        sendRequest: (sentRequest: MeshyRequest, sentCallback: any) => {
            passedRequest = sentRequest;
            passedCallback = sentCallback;
        }
    }
    const authId = guid();
    const service = new MeshesService(authId, requestService);
    const meshName = guid();
    const queryData = {
        filter: { data: 5 },
        orderby: { data: -1 },
        pageNumber: 1,
        pageSize: 0
    };

    service.search(meshName, queryData).then(_ => {
        expect(true).toBeTruthy();
    });

    expect(passedRequest.queryData.pageSize).toBe(25);
});

test("create should send proper request", () => {
    let passedRequest = {} as MeshyRequest;
    let passedCallback: any;

    const requestService: IRequestService = {
        sendRequest: (sentRequest: MeshyRequest, sentCallback: any) => {
            passedRequest = sentRequest;
            passedCallback = sentCallback;
        }
    }
    const authId = guid();
    const service = new MeshesService(authId, requestService);
    const meshName = guid();

    const data = new MeshDataMock();
    data.data = 5;

    service.create(meshName, data).then(_ => {
        expect(true).toBeTruthy();
    });
    const expectedData = JSON.parse(JSON.stringify(data)) as MeshDataMock;
    delete expectedData._id;
    expect(passedRequest.authenticationId).toBe(authId);
    expect(passedRequest.path).toBe(`meshes/${meshName}`);
    expect(passedRequest.source).toBe("api");
    expect(passedRequest.method).toBe("POST");
    expect(passedRequest.type).toBe(null);
    expect(passedRequest.data).toMatchObject(expectedData);
    expect(passedRequest.queryData).toBe(null);
    passedCallback(null, { ok: true });
});

test("update should send proper request", () => {
    let passedRequest = {} as MeshyRequest;
    let passedCallback: any;

    const requestService: IRequestService = {
        sendRequest: (sentRequest: MeshyRequest, sentCallback: any) => {
            passedRequest = sentRequest;
            passedCallback = sentCallback;
        }
    }
    const authId = guid();
    const service = new MeshesService(authId, requestService);
    const meshName = guid();
    const meshId = guid();
    const data = new MeshDataMock();
    data.data = 5;

    service.update(meshName, data, meshId).then(_ => {
        expect(true).toBeTruthy();
    });
    const expectedData = JSON.parse(JSON.stringify(data)) as MeshDataMock;
    delete expectedData._id;
    expect(passedRequest.authenticationId).toBe(authId);
    expect(passedRequest.path).toBe(`meshes/${meshName}/${meshId}`);
    expect(passedRequest.source).toBe("api");
    expect(passedRequest.method).toBe("PUT");
    expect(passedRequest.type).toBe(null);
    expect(passedRequest.data).toMatchObject(expectedData);
    expect(passedRequest.queryData).toBe(null);
    passedCallback(null, { ok: true });
});

test("update should derive id from MeshData", () => {
    let passedRequest = {} as MeshyRequest;
    let passedCallback: any;

    const requestService: IRequestService = {
        sendRequest: (sentRequest: MeshyRequest, sentCallback: any) => {
            passedRequest = sentRequest;
            passedCallback = sentCallback;
        }
    }
    const authId = guid();
    const service = new MeshesService(authId, requestService);
    const meshName = guid();
    const meshId = guid();
    const data = new MeshDataMock();
    data.data = 5;
    data._id = meshId;

    service.update(meshName, data).then(_ => {
        expect(true).toBeTruthy();
    });
    const expectedData = JSON.parse(JSON.stringify(data)) as MeshDataMock;
    delete expectedData._id;
    expect(passedRequest.authenticationId).toBe(authId);
    expect(passedRequest.path).toBe(`meshes/${meshName}/${meshId}`);
    expect(passedRequest.source).toBe("api");
    expect(passedRequest.method).toBe("PUT");
    expect(passedRequest.type).toBe(null);
    expect(passedRequest.data).toMatchObject(expectedData);
    expect(passedRequest.queryData).toBe(null);
    passedCallback(null, { ok: true });
});

test("delete should send proper request", () => {
    let passedRequest = {} as MeshyRequest;
    let passedCallback: any;

    const requestService: IRequestService = {
        sendRequest: (sentRequest: MeshyRequest, sentCallback: any) => {
            passedRequest = sentRequest;
            passedCallback = sentCallback;
        }
    }
    const authId = guid();
    const service = new MeshesService(authId, requestService);
    const meshName = guid();
    const meshId = guid();

    service.delete(meshName, meshId).then(_ => {
        expect(true).toBeTruthy();
    });

    expect(passedRequest.authenticationId).toBe(authId);
    expect(passedRequest.path).toBe(`meshes/${meshName}/${meshId}`);
    expect(passedRequest.source).toBe("api");
    expect(passedRequest.method).toBe("DELETE");
    expect(passedRequest.type).toBeNull();
    expect(passedRequest.data).toBeNull();
    expect(passedRequest.queryData).toBeNull();
    passedCallback(null, { ok: true });
});

test("deleteCollection should send proper request", () => {
    let passedRequest = {} as MeshyRequest;
    let passedCallback: any;

    const requestService: IRequestService = {
        sendRequest: (sentRequest: MeshyRequest, sentCallback: any) => {
            passedRequest = sentRequest;
            passedCallback = sentCallback;
        }
    }
    const authId = guid();
    const service = new MeshesService(authId, requestService);
    const meshName = guid();

    service.deleteCollection(meshName).then(_ => {
        expect(true).toBeTruthy();
    });

    expect(passedRequest.authenticationId).toBe(authId);
    expect(passedRequest.path).toBe(`meshes/${meshName}`);
    expect(passedRequest.source).toBe("api");
    expect(passedRequest.method).toBe("DELETE");
    expect(passedRequest.type).toBeNull();
    expect(passedRequest.data).toBeNull();
    expect(passedRequest.queryData).toBeNull();
    passedCallback(null, { ok: true });
});