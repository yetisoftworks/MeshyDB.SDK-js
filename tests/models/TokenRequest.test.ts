import { TokenRequest } from "../../src/models";

test("Should create TokenRequest", () => {
    const model = new TokenRequest();
    expect(model).toBeTruthy();
});

test("client_id should default to be empty", () => {
    const model = new TokenRequest();
    expect(model.client_id).toBe('');
});

test("client_secret should default to be empty", () => {
    const model = new TokenRequest();
    expect(model.client_secret).toBe('');
});

test("grant_type should default to be 'password'", () => {
    const model = new TokenRequest();
    expect(model.grant_type).toBe('password');
});

test("username should default to be empty", () => {
    const model = new TokenRequest();
    expect(model.username).toBe('');
});

test("password should default to be empty", () => {
    const model = new TokenRequest();
    expect(model.password).toBe('');
});

test("scope should default to be 'meshy.api offline_access openid'", () => {
    const model = new TokenRequest();
    expect(model.scope).toBe('meshy.api offline_access openid');
});

test("refresh_token should default to be empty", () => {
    const model = new TokenRequest();
    expect(model.refresh_token).toBe('');
});