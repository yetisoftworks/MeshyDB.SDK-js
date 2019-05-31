import { MeshyDB } from './services/MeshyDB';

export function initializeMeshyDB(clientKey: string, publicKey: string): IMeshyDB {
  return new MeshyDB(clientKey, publicKey);
}

export function initializeMeshyDBwithTenant(clientKey: string, tenant: string, publicKey: string): IMeshyDB {
  return new MeshyDB(clientKey, publicKey, tenant);
}

export interface IMeshyDB {
  login(username: string, password: string): Promise<IMeshyDBClient>;
  loginWithPersistance(persistanceToken: string): Promise<IMeshyDBClient>;
  createUser(newUser: INewUser): Promise<IUser>;
  forgotPassword(username: string): Promise<IPasswordResetHash>;
  resetPassword(passwordResetHash: IPasswordResetHash, newPassword: string): Promise<void>;
  loginAnonymously(username?: string): Promise<IMeshyDBClient>;
}

export interface IMeshesService {
  get<T extends IMeshData>(meshName: string, id: string): Promise<T>;
  search<T extends IMeshData>(
    meshName: string,
    query: {
      filter: any | undefined;
      orderby: any | undefined;
      pageNumber: number | undefined;
      pageSize: number | undefined;
    },
  ): Promise<IPageResult<T>>;
  create<T extends IMeshData>(meshName: string, data: T): Promise<T>;
  update<T extends IMeshData>(meshName: string, data: T, id?: string): Promise<T>;
  delete(meshName: string, id: string): Promise<void>;
  deleteCollection(meshName: string): Promise<void>;
}

export interface IMeshyDBClient {
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
  _id: string | undefined;
  _rid: string | undefined;
}

export interface IUser {
  id: string | undefined;
  username: string;
  firstName: string | null | undefined;
  lastName: string | null | undefined;
  verified: boolean;
  isActive: boolean;
  phoneNumber: string | null | undefined;
  roles: string[] | undefined;
}

export interface INewUser extends IUser {
  newPassword: string;
}

export interface IPasswordResetHash {
  username: string;
  expires: Date;
  hash: string;
}

export interface IPageResult<T> {
  results: T[];
  page: number;
  pageSize: number;
  totalRecords: number;
}
