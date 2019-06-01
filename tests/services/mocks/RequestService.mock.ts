import { MeshyRequest } from "../../../src/models";
import { IRequestService } from "../../../src/services";

export class RequestServiceMock implements IRequestService {
    public sendRequest(request: MeshyRequest): void {
        return;
    }
}