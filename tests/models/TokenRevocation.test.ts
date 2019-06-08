import { TokenRevocation } from "../../src/models/TokenRevocation";

test("Should create TokenRevocation", () => {
    const model = new TokenRevocation();
    expect(model).toBeTruthy();
});

test("token should default to be empty", () => {
    const model = new TokenRevocation();
    expect(model.token).toBe('');
});

test("token_type_hint should default to be empty", () => {
    const model = new TokenRevocation();
    expect(model.token_type_hint).toBe('');
});

test("client_id should default to be empty", () => {
    const model = new TokenRevocation();
    expect(model.client_id).toBe('');
});