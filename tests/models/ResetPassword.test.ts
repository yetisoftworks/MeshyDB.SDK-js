import { ResetPassword } from "../../src/models";

test("Should create ResetPassword",()=>{
    const model = new ResetPassword();
    expect(model).toBeTruthy();
});

test("username should default be empty",()=>{
    const model = new ResetPassword();
    expect(model.username).toBe('');
});

test("expires should default be now",()=>{
    const model = new ResetPassword();
    expect(model.expires.toString()).toBe(new Date().toString());
});

test("hash should default be empty",()=>{
    const model = new ResetPassword();
    expect(model.hash).toBe('');
});

test("newPassword should default be empty",()=>{
    const model = new ResetPassword();
    expect(model.newPassword).toBe('');
});