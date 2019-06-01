import superagent from 'superagent';
import { Utils } from "../../src/services";

test("Javascript iso date string should be converted to type date", () => {
    const date = new Date().toISOString();
    expect(Utils.jsonReviver(null, date)).toBeInstanceOf(Date);
});

test("Date string should not be converted", () => {
    const date = '1/1/1900';
    expect(Utils.jsonReviver(null, date)).toBe(date);
});


test('configure callback reject when response is not ok', () => {

    new Promise<any>((resolve, reject) => {
        const callback = Utils.configureCallback(resolve, reject);
        const response = {} as superagent.Response;
        response.ok = false;
        callback("this is the error", response);
    }).catch(err => {
        expect(err).toBe("this is the error");
    });
});

test('configure callback resolve when response is ok', () => {
    const body = { anything: true };
    new Promise<any>((resolve, reject) => {
        const callback = Utils.configureCallback(resolve, reject);
        const response = {} as superagent.Response;
        response.ok = true;
        response.body = body;
        callback("this is the error", response);
    }).then(data => {
        expect(data).toBe(body);
    });
});