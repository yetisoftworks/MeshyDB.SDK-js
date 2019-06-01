import { UserPasswordUpdate } from "../../src/models";

test("Should create UserPasswordUpdate",()=>{
    const model = new UserPasswordUpdate();
    expect(model).toBeTruthy();
});

test("newPassword should default to be empty",()=>{
    const model = new UserPasswordUpdate();
    expect(model.newPassword).toBe('');
});

test("previousPassword should default to be empty",()=>{
    const model = new UserPasswordUpdate();
    expect(model.previousPassword).toBe('');
});