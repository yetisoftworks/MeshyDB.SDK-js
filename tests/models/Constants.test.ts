import { v4 as guid } from 'uuid';
import { Constants } from '../../src/models/Constants';

test("Should create constants", () => {
    expect(new Constants(guid(), guid())).toBeTruthy();
});

test("Should create constants with tenant", () => {
    expect(new Constants(guid(), guid(), guid())).toBeTruthy();
});

test("Constants should throw error when client key is empty", () => {
    expect(() => new Constants("", guid(), guid())).toThrowError();
});

test("Constants should throw error when public key is empty", () => {
    expect(() => new Constants(guid(), "", guid())).toThrowError();
});

test("Api url should be configured", () => {
    const clientKey = guid();
    const constants = new Constants(clientKey, guid(), guid());

    expect(constants.apiUrl).toBe(`https://api.meshydb.com/${clientKey}`);
});

test("Auth url should be configured", () => {
    const clientKey = guid();
    const constants = new Constants(clientKey, guid(), guid());

    expect(constants.authUrl).toBe(`https://auth.meshydb.com/${clientKey}`);
});

test("Should create constants with tenant", () => {
    const tenant = guid();
    const constants = new Constants(guid(), guid(), tenant);
    expect(constants.tenant).toBe(tenant);
});


test("Public key should be copied", () => {
    const publicKey = guid();
    const constants = new Constants(guid(), publicKey, guid());
    expect(constants.publicKey).toBe(publicKey);
});

test("Tenant should be copied", () => {
    const tenant = guid();
    const constants = new Constants(guid(), guid(), tenant);
    expect(constants.tenant).toBe(tenant);
});