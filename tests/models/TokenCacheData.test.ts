import { TokenCacheData } from "../../src/models/TokenCacheData";

test("Should create TokenCacheData", () => {
    const model = new TokenCacheData();
    expect(model).toBeTruthy();
});

test("token should default to be empty", () => {
    const model = new TokenCacheData();
    expect(model.token).toBe('');
});

test("refreshToken should default to be empty", () => {
    const model = new TokenCacheData();
    expect(model.refreshToken).toBe('');
});

test("expires should default to be now", () => {
    const model = new TokenCacheData();
    expect(model.expires.toString()).toBe(new Date().toString());
});