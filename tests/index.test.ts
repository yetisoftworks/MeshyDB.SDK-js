import { v4 as guid } from 'uuid';
import { initializeMeshyDB, initializeMeshyDBwithTenant } from "../src";


test("initializeMeshyDB should create MeshyDB", () => {
    const db = initializeMeshyDB(guid(), guid());
    expect(db).toBeDefined();
});

test("initializeMeshyDBwithTenant should create MeshyDB", () => {
    const db = initializeMeshyDBwithTenant(guid(), guid(), guid());
    expect(db).toBeDefined();
});