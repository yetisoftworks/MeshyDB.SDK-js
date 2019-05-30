import { MeshyDb } from './services/MeshyDb';

export function initializeMeshyDb(clientKey: string, publicKey: string, tenant: string): IMeshyDb {
  return new MeshyDb(clientKey, publicKey, tenant);
}

export interface IMeshyDb {
  login(username: string, password: string): Promise<IMeshyDbClient>;
  loginWithPersistance(persistanceToken: string): Promise<IMeshyDbClient>;
  createUser(newUser: INewUser): Promise<IUser>;
  forgotPassword(username: string): Promise<IPasswordResetHash>;
  resetPassword(passwordResetHash: IPasswordResetHash, newPassword: string): Promise<void>;
  loginAnonymously(username?: string): Promise<IMeshyDbClient>;
}

export interface IMeshesService {
  get<T extends IMeshData>(meshName: string, id: string): Promise<T>;
  search<T extends IMeshData>(
    meshName: string,
    query: {
      filter: any;
      orderby: any;
      pageNumber: number;
      pageSize: number;
    },
  ): Promise<PageResult<T>>;
  create<T extends IMeshData>(meshName: string, data: T): Promise<T>;
  update<T extends IMeshData>(meshName: string, data: T, id?: string): Promise<T>;
  delete(meshName: string, id: string): Promise<void>;
  deleteCollection(meshName: string): Promise<void>;
}

export interface IMeshyDbClient {
  usersService: IUsersService;
  meshesService: IMeshesService;
  updatePassword(previousPassword: string, newPassword: string): Promise<void>;
  signout(): Promise<void>;
  retrievePersistanceToken(): string | null;
  getMyUserInfo(): Promise<any>;
}

export interface IUsersService {
  getSelf(): Promise<IUser>;
  updateSelf(user: IUser): Promise<IUser>;
}

export interface IMeshData {
  _id: string;
  _rid: string;
}

export interface IUser {
  id: string;
  username: string | null;
  firstName: string | null;
  lastName: string | null;
  verified: boolean;
  isActive: boolean;
  phoneNumber: string | null;
  roles: string[];
}

export interface INewUser extends IUser {
  newPassword: string;
}

export interface IPasswordResetHash {
  username: string;
  expires: Date;
  hash: string;
}

export interface PageResult<T> {
  results: T[];
  page: number;
  pageSize: number;
  totalRecords: number;
}
