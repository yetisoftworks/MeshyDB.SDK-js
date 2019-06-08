import superagent from 'superagent';
import { MeshyRequest } from '../../src/models/MeshyRequest';

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