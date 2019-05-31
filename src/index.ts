import { MeshyDB } from './services';

/**
 * Initializes MeshyDB to establish a client
 * @param clientKey MeshyDB account name
 * @param publicKey Client Public key for default tenant
 */
export function initializeMeshyDB(clientKey: string, publicKey: string): IMeshyDB {
  return new MeshyDB(clientKey, publicKey);
}

/**
 * Initializes MeshyDB to establish a client
 * @param clientKey MeshyDB account name
 * @param tenant Name of tenant to connect
 * @param publicKey Client Public key for specified tenant
 */
export function initializeMeshyDBwithTenant(clientKey: string, tenant: string, publicKey: string): IMeshyDB {
  return new MeshyDB(clientKey, publicKey, tenant);
}

/**
 * Defines MeshyDB connection
 */
export interface IMeshyDB {
  /**
   * Gets established client connection for user
   * @param username Username to log in with
   * @param password Password of user to log in with
   */
  login(username: string, password: string): Promise<IMeshyDBClient>;
  /**
   * Gets established client connection for previously logged in user
   * @param persistanceToken Long living token to request login at a later time
   */
  loginWithPersistance(persistanceToken: string): Promise<IMeshyDBClient>;
  /**
   * Creates a user within the system
   * @param newUser User to create
   */
  createUser(newUser: INewUser): Promise<IUser>;
  /**
   * Generates request for password recovery
   * @param username User name to  recover password for
   */
  forgotPassword(username: string): Promise<IPasswordResetHash>;
  /**
   * Reserts password for user  based on hash  data
   * @param passwordResetHash Hashed data for password reset parity
   * @param newPassword New password for user
   */
  resetPassword(passwordResetHash: IPasswordResetHash, newPassword: string): Promise<void>;
  /**
   * Gets established client connection for anonymous
   * @param username Optional username to log in with
   */
  loginAnonymously(username?: string): Promise<IMeshyDBClient>;
}

/**
 * Defines service to manage meshes
 */
export interface IMeshesService {
  /**
   * Gets mesh data
   * @param meshName Name of mesh collection
   * @param id Id of mesh data to retrieve
   */
  get<T extends IMeshData>(meshName: string, id: string): Promise<T>;
  /**
   * Gets mesh data
   * @param meshName Name of mesh collection
   * @param query Query data for searching mesh data
   */
  search<T extends IMeshData>(
    meshName: string,
    query: {
      filter: any | undefined;
      orderby: any | undefined;
      pageNumber: number | undefined;
      pageSize: number | undefined;
    },
  ): Promise<IPageResult<T>>;
  /**
   * Creates mesh data
   * @param meshName Name of mesh collection
   * @param data Mesh data to save
   */
  create<T extends IMeshData>(meshName: string, data: T): Promise<T>;
  /**
   * Updates mesh data
   * @param meshName Name of mesh collection
   * @param data Mesh data to save
   * @param id Id of mesh data to update
   */
  update<T extends IMeshData>(meshName: string, data: T, id?: string): Promise<T>;
  /**
   * Delete mesh data
   * @param meshName Name of mesh collection
   * @param id Id of mesh data to update
   */
  delete(meshName: string, id: string): Promise<void>;
  /**
   * Delete mesh collection
   * @param meshName Name of mesh collection
   */
  deleteCollection(meshName: string): Promise<void>;
}

/**
 * Defines MeshyDB client for authenticated user
 */
export interface IMeshyDBClient {
  /**
   * Service to manage logged in user
   */
  usersService: IUsersService;
  /**
   * Service to manage meshes
   */
  meshesService: IMeshesService;
  /**
   * Update password for logged in user
   * @param previousPassword Previous password for user
   * @param newPassword New password for user
   */
  updatePassword(previousPassword: string, newPassword: string): Promise<void>;
  /**
   * Sign out currently logged in user
   */
  signout(): Promise<void>;
  /**
   * Retrieve Persistance token to be used for a later login
   */
  retrievePersistanceToken(): string | null;
  /**
   * Gets user info claims
   */
  getMyUserInfo(): Promise<any>;
}

/**
 * Defines service to manage users
 */
export interface IUsersService {
  /**
   * Get logged in user
   */
  getSelf(): Promise<IUser>;
  /**
   * Update logged in user
   * @param user User data to be updated
   */
  updateSelf(user: IUser): Promise<IUser>;
}

/**
 * Defines Mesh Data
 */
export interface IMeshData {
  /**
   * System field representing the id of an item
   */
  _id: string | undefined;

  /**
   * System field representing the reference id of an item
   */
  _rid: string | undefined;
}

/**
 * Defines user
 */
export interface IUser {
  /**
   * Id representing a user
   */
  id: string | undefined;
  /**
   * Name representing a user
   */
  username: string;
  /**
   * Optional field for first name
   */
  firstName: string | null | undefined;
  /**
   * Optional field for last name
   */
  lastName: string | null | undefined;
  /**
   * Identifies if a user has been verified
   */
  verified: boolean;
  /**
   * Identifies if a user is considered active
   */
  isActive: boolean;
  /**
   * Optional field for phone number
   */
  phoneNumber: string | null | undefined;
  /**
   * Optional field defining a users set of roles
   */
  roles: string[] | undefined;
}

/**
 * Defines a new user
 */
export interface INewUser extends IUser {
  /**
   * New password for user
   */
  newPassword: string;
}

/**
 * Defines a password reset hash request
 */
export interface IPasswordResetHash {
  /**
   * Username requested password reset
   */
  username: string;
  /**
   * Identifies when the hash will expire
   */
  expires: Date;
  /**
   * System generated hash for password reset parity
   */
  hash: string;
}

/**
 * Defines a page result for a search
 */
export interface IPageResult<T> {
  /**
   * Defines results of data
   */
  results: T[];
  /**
   * Defines which page of data
   */
  page: number;
  /**
   * Defines the size of the page returned
   */
  pageSize: number;
  /**
   * Defines how many records were returned
   */
  totalRecords: number;
}
