import { MeshyRequest } from "../../../src/models/MeshyRequest";
import { IRequestService } from "../../../src/services/RequestService";

export class RequestServiceMock implements IRequestService {
    public sendRequest(request: MeshyRequest): void {
        return;
    }
}