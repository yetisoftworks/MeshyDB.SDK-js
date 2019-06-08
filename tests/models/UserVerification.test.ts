import { UserVerification } from "../../src/models/UserVerification";

test('Should create Forgot Password', () => {
    expect(new UserVerification()).toBeTruthy();
});

test('Username should be empty', () => {
    const model = new UserVerification();
    expect(model.username).toBe('');
});