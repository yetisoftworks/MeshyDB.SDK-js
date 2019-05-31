import { Constants } from "../../src/models";
import { v4 as guid } from 'uuid';

test("Should create constants", () => {
    expect(new Constants(guid(), guid())).toBeTruthy();
});