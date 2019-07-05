import { v4 as guid } from 'uuid';
import { initializeMeshyClient, initializeMeshyClientwithTenant } from "../src";


test("initializeMeshyDB should create MeshyDB", () => {
    const db = initializeMeshyClient(guid(), guid());
    expect(db).toBeDefined();
});

test("initializeMeshyClientwithTenant should create MeshyDB", () => {
    const db = initializeMeshyClientwithTenant(guid(), guid(), guid());
    expect(db).toBeDefined();
});