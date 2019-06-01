import { ForgotPassword } from "../../src/models";

test('Should create Forgot Password', () => {
    expect(new ForgotPassword()).toBeTruthy();
});

test('Username should be empty', () => {
    const model = new ForgotPassword();
    expect(model.username).toBe('');
});