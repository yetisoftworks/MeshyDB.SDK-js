import { IMeshData } from "../../../src";

export class MeshDataMock implements IMeshData {
    public _id: string | undefined;
    public _rid: string | undefined;
    public data: number = 0;
}