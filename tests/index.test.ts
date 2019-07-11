import { v4 as guid } from 'uuid';
import { MeshyClient } from "../src";

test("MeshyClient.initializeWithTenant should create MeshyDB", () => {
    const db = MeshyClient.initialize(guid(), guid());
    expect(db).toBeDefined();
});

test("MeshyClient.initializeWithTenant should create MeshyDB", () => {
    const db = MeshyClient.initializeWithTenant(guid(), guid(), guid());
    expect(db).toBeDefined();
});