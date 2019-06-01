import superagent from 'superagent';
import { MeshyRequest } from "../../src/models";

test('Should create MeshyRequest', () => {
    const model = new MeshyRequest();
    expect(model).toBeTruthy();
});

test('data should default null', () => {
    const model = new MeshyRequest();
    expect(model.data).toBeNull();
});

test('path should default is empty', () => {
    const model = new MeshyRequest();
    expect(model.path).toBe('');
});

test('type should default is null', () => {
    const model = new MeshyRequest();
    expect(model.type).toBeNull();
});

test('authenticationId should default is null', () => {
    const model = new MeshyRequest();
    expect(model.authenticationId).toBeNull();
});

test('source should default is "api"', () => {
    const model = new MeshyRequest();
    expect(model.source).toBe('api');
});

test('method should default is "GET"', () => {
    const model = new MeshyRequest();
    expect(model.method).toBe('GET');
});

test('queryData should default is null', () => {
    const model = new MeshyRequest();
    expect(model.queryData).toBeNull();
});

test('callback should be set', () => {
    const model = new MeshyRequest();
    expect(model.callback).toBeDefined();
});

test('configure callback should set callback to something', () => {
    const model = new MeshyRequest();
    const existingCallback = model.callback;
    new Promise<any>((resolve, reject) => {
        model.configureCallback(resolve, reject);
        expect(model.callback).not.toBe(existingCallback);
    }).then(_=>{
        return;
    });
});

test('configure callback reject when response is not ok', () => {
    const model = new MeshyRequest();
    new Promise<any>((resolve, reject) => {
        model.configureCallback(resolve, reject);
        const response = {} as superagent.Response;
        response.ok = false;
        model.callback("this is the error", response);
    }).catch(err => {
        expect(err).toBe("this is the error");
    });
});

test('configure callback resolve when response is ok', () => {
    const model = new MeshyRequest();

    const body = { anything: true };
    new Promise<any>((resolve, reject) => {
        model.configureCallback(resolve, reject);
        const response = {} as superagent.Response;
        response.ok = true;
        response.body = body;
        model.callback("this is the error", response);
    }).then(data => {
        expect(data).toBe(body);
    });
});