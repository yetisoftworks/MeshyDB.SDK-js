import { IPageResult, IProjectionsService } from '..';
import { MeshyRequest } from '../models/MeshyRequest';
import { IRequestService } from './RequestService';
import { Utils } from './Utils';

export class ProjectionsService implements IProjectionsService {
    private authenticationId: string;
    private requestService: IRequestService;
    constructor(authId: string, requestService: IRequestService) {
        this.authenticationId = authId;
        this.requestService = requestService;
    }

    public get = <T>(projectionName: string,
        query?: {
            orderBy?: any;
            page?: number;
            pageSize?: number;
        }) => {
        query = query || {
            page: 1,
            pageSize: 25,
        };
        query.page = query.page || 1;
        query.pageSize = query.pageSize || 25;

        return new Promise<IPageResult<T>>((resolve, reject) => {
            const request = new MeshyRequest();
            request.authenticationId = this.authenticationId;
            request.path = `projections/${projectionName}`;
            request.queryData = query;

            this.requestService.sendRequest(request, Utils.configureCallback(resolve, reject));
        });
    };
}