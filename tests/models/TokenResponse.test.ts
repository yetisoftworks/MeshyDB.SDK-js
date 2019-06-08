import { TokenResponse } from "../../src/models/TokenResponse";

test("Should create TokenResponse", () => {
    const model = new TokenResponse();
    expect(model).toBeTruthy();
});

test("access_token should default to be empty", () => {
    const model = new TokenResponse();
    expect(model.access_token).toBe('');
});

test("expires_in should default to be 3600", () => {
    const model = new TokenResponse();
    expect(model.expires_in).toBe(3600);
});

test("token_type should default to be empty", () => {
    const model = new TokenResponse();
    expect(model.token_type).toBe('');
});

test("refresh_token should default to be empty", () => {
    const model = new TokenResponse();
    expect(model.refresh_token).toBe('');
});