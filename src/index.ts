import { MeshyClient as InternalMeshyClient } from './services/MeshyClient';

/**
 * Handles Meshy Client management
 */
export class MeshyClient {
  /**
   * Initializes MeshyDB to establish a client
   * @param accountName MeshyDB account name
   * @param publicKey Client Public key for default tenant
   */
  public static initialize = (accountName: string, publicKey: string): IMeshyClient => {
    return new InternalMeshyClient(accountName, publicKey);
  };

  /**
   * Initializes MeshyDB to establish a client
   * @param accountName MeshyDB account name
   * @param tenant Name of tenant to connect
   * @param publicKey Client Public key for specified tenant
   */
  public static initializeWithTenant = (accountName: string, tenant: string, publicKey: string): IMeshyClient => {
    return new InternalMeshyClient(accountName, publicKey, tenant);
  };

  /**
   * Gets current authenticated Meshy connection
   */
  public static get currentConnection(): IMeshyConnection | null {
    return InternalMeshyClient.currentConnection;
  }

  /**
   * Gets established client connection for user
   * @param username Username to log in with
   * @param password Password of user to log in with
   */
  public static login(username: string, password: string): Promise<IMeshyConnection> {
    if (!InternalMeshyClient.currentClient) {
      throw new Error('MeshyClient.initialize has not been called.');
    }

    return InternalMeshyClient.currentClient.login(username, password);
  }

  /**
   * Gets established client connection for previously logged in user
   * @param refreshToken Long living token to request login at a later time
   */
  public static loginWithRefresh(refreshToken: string): Promise<IMeshyConnection> {
    if (!InternalMeshyClient.currentClient) {
      throw new Error('MeshyClient.initialize has not been called.');
    }

    return InternalMeshyClient.currentClient.loginWithRefresh(refreshToken);
  }

  /**
   * Registers a user within the system
   * @param user User to create
   */
  public static registerUser(user: IRegisterUser): Promise<IUserVerificationHash> {
    if (!InternalMeshyClient.currentClient) {
      throw new Error('MeshyClient.initialize has not been called.');
    }

    return InternalMeshyClient.currentClient.registerUser(user);
  }

  /**
   * Registers anonymous user within the system
   * @param username Username to log in with
   */
  public static registerAnonymousUser(username?: string | undefined): Promise<IUser> {
    if (!InternalMeshyClient.currentClient) {
      throw new Error('MeshyClient.initialize has not been called.');
    }

    return InternalMeshyClient.currentClient.registerAnonymousUser(username);
  }

  /**
   * Generates request for password recovery
   * @param username Username to recover password for
   */
  public static forgotPassword(username: string, attempt?: number | undefined): Promise<IUserVerificationHash> {
    if (!InternalMeshyClient.currentClient) {
      throw new Error('MeshyClient.initialize has not been called.');
    }

    return InternalMeshyClient.currentClient.forgotPassword(username, attempt);
  }

  /**
   * Resets password for user  based on hash  data
   * @param resetPassword Reset password request to verify user and set new password
   */
  public static resetPassword(resetPassword: IResetPassword): Promise<void> {
    if (!InternalMeshyClient.currentClient) {
      throw new Error('MeshyClient.initialize has not been called.');
    }

    return InternalMeshyClient.currentClient.resetPassword(resetPassword);
  }

  /**
   * Gets established client connection for anonymous
   * @param username Optional username to log in with
   */
  public static loginAnonymously(username: string): Promise<IMeshyConnection> {
    if (!InternalMeshyClient.currentClient) {
      throw new Error('MeshyClient.initialize has not been called.');
    }

    return InternalMeshyClient.currentClient.loginAnonymously(username);
  }

  /**
   * Check hash of request to ensure correctness
   * @param userVerificationCheck Verification data to check request
   */
  public static checkHash(userVerificationCheck: IUserVerificationCheck): Promise<IValid> {
    if (!InternalMeshyClient.currentClient) {
      throw new Error('MeshyClient.initialize has not been called.');
    }

    return InternalMeshyClient.currentClient.checkHash(userVerificationCheck);
  }

  /**
   * Verify user to allow access to application
   * @param userVerificationCheck Verification data to check request
   */
  public static verifyUser(userVerificationCheck: IUserVerificationCheck): Promise<void> {
    if (!InternalMeshyClient.currentClient) {
      throw new Error('MeshyClient.initialize has not been called.');
    }

    return InternalMeshyClient.currentClient.verifyUser(userVerificationCheck);
  }

  /**
   * Checks if username already exists
   * @param username Username to check
   */
  public static checkUserExist(username: string): Promise<IExist> {
    if (!InternalMeshyClient.currentClient) {
      throw new Error('MeshyClient.initialize has not been called.');
    }

    return InternalMeshyClient.currentClient.checkUserExist(username);
  }
}

/**
 * Defines MeshyDB connection
 */
export interface IMeshyClient {
  /**
   * Gets established client connection for user
   * @param username Username to log in with
   * @param password Password of user to log in with
   */
  login(username: string, password: string): Promise<IMeshyConnection>;
  /**
   * Gets established client connection for previously logged in user
   * @param refreshToken Long living token to request login at a later time
   */
  loginWithRefresh(refreshToken: string): Promise<IMeshyConnection>;
  /**
   * Registers a user within the system
   * @param user User to create
   */
  registerUser(user: IRegisterUser): Promise<IUserVerificationHash>;
  /**
   * Registers anonymous user within the system
   * @param username Username to log in with
   */
  registerAnonymousUser(username?: string): Promise<IUser>;
  /**
   * Generates request for password recovery
   * @param username Username to recover password for
   */
  forgotPassword(username: string, attempt?: number): Promise<IUserVerificationHash>;
  /**
   * Resets password for user  based on hash  data
   * @param resetPassword Reset password request to verify user and set new password
   */
  resetPassword(resetPassword: IResetPassword): Promise<void>;
  /**
   * Gets established client connection for anonymous
   * @param username Optional username to log in with
   */
  loginAnonymously(username: string): Promise<IMeshyConnection>;
  /**
   * Check hash of request to ensure correctness
   * @param userVerificationCheck Verification data to check request
   */
  checkHash(userVerificationCheck: IUserVerificationCheck): Promise<IValid>;
  /**
   * Verify user to allow access to application
   * @param userVerificationCheck Verification data to check request
   */
  verifyUser(userVerificationCheck: IUserVerificationCheck): Promise<void>;
  /**
   * Checks if username already exists
   * @param username Username to check
   */
  checkUserExist(username: string): Promise<IExist>;
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
    query?: {
      filter?: any;
      orderBy?: any;
      page?: number;
      pageSize?: number;
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
   * Delete mesh data that meet filter criteria
   * @param meshName Name of mesh collection
   * @param filter Filter to be met for data to be deleted
   */
  deleteMany(meshName: string, filter: any): Promise<IDeleteManyResult>;
  /**
   * Update mesh data that meets filter criteria
   * @param meshName Name of mesh collection
   * @param filter Filter to be met for data to be updated
   * @param update MongoDB update command to update bulk set of data
   */
  updateMany(meshName: string, filter: string, update: string): Promise<IUpdateManyResult>;
  /**
   * Creates mesh data
   * @param meshName Name of mesh collection
   * @param data Collection of data to be created
   */
  createMany<T extends IMeshData>(meshName: string, data: T[]): Promise<ICreateManyResult>;
}

/**
 * Defines service to manage projections
 */
export interface IProjectionsService {
  /**
   * Gets projection data
   * @param projectionName Name of projection
   * @param query Query data for retrieving data
   */
  get<T>(
    projectionName: string,
    query?: {
      filter?: any;
      orderBy?: any;
      page?: number;
      pageSize?: number;
    },
  ): Promise<IPageResult<T>>;
}
/**
 * Defines result when deleting multiple records
 */
export interface IDeleteManyResult {
  /**
   * Count of how many items were deleted
   */
  deletedCount: number;
  /**
   * Identifies if the delete was acknowledged.
   */
  isAcknowledged: boolean;
}
/**
 * Defines result when updating multiple records
 */
export interface IUpdateManyResult {
  /**
   * Identifies if the update was acknowledged.
   */
  isAcknowledged: boolean;
  /**
   * Identifies if the modified count is available.
   */
  isModifiedCountAvailable: boolean;
  /**
   * Count of how many records were matched with filter.
   */
  matchedCount: number;
  /**
   * Count of how many records were modified based on the provided filter.
   */
  modifiedCount: number;
  /**
   * Id of record created based on upsert.
   */

  upsertedId: any;
}
/**
 * Defines result when creating multiple records
 */
export interface ICreateManyResult {
  /**
   * Count of how many items were created
   */
  createdCount: number;
}
/**
 * Defines MeshyDB client for authenticated user
 */
export interface IMeshyConnection {
  /**
   * Service to manage logged in user
   */
  usersService: IUsersService;
  /**
   * Service to manage meshes
   */
  meshesService: IMeshesService;
  /**
   * Service to manage projections
   */
  projectionsService: IProjectionsService;
  /**
   * Service to manage roles
   */
  rolesService: IRolesService;
  /**
   * Retrieve currently authorized user
   */
  currentUser: ICurrentUser | null;
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
   * Retrieve refresh token to be used for a later login
   */
  retrieveRefreshToken(): string | null;
}
/**
 * Defines service to manage roles
 */
export interface IRolesService {
  /**
   * Gets role
   * @param id id of role to retrieve
   */
  get(id: string): Promise<IRole>;
  /**
   * Gets roles
   * @param query Query data for searching roles
   */
  search(query?: { name?: string; page?: number; pageSize?: number }): Promise<IPageResult<IRole>>;
  /**
   * Creates role
   * @param model Role data to save
   */
  create(model: IRole): Promise<IRole>;
  /**
   * Updates role
   * @param id Id of role to update
   * @param model Role data to update
   */
  update(id: string, model: IRole): Promise<IRole>;
  /**
   * Deletes role
   * @param id Id of role to delete
   */
  delete(id: string): Promise<void>;
  /**
   * Gets permission for role
   * @param roleId Id of role to scope permissions to retrieve
   * @param permissionId Id of permission to retrieve
   */
  getPermission(roleId: string, permissionId: string): Promise<IPermission>;
  /**
   * Gets permissions for a role
   * @param roleId Id of role to scope permissions to retrieve
   * @param query Query data for searching role
   */
  searchPermission(
    roleId: string,
    query?: {
      permissibleName?: string;
      page?: number;
      pageSize?: number;
    },
  ): Promise<IPageResult<IPermission>>;
  /**
   * Create permission for role
   * @param roleId Id of role to scope permission to create
   * @param model Permission data to create
   */
  createPermission(roleId: string, model: IPermission): Promise<IPermission>;
  /**
   * Update permission for role
   * @param roleId Id of role to scope permission to update
   * @param permissionId Id of permission to update
   * @param model Permission data to update
   */
  updatePermission(roleId: string, permissionId: string, model: IPermission): Promise<IPermission>;
  /**
   * Delete permission
   * @param roleId Id of role to scope permission to delete
   * @param permissionId Id of permission to delete
   */
  deletePermission(roleId: string, permissionId: string): Promise<void>;
  /**
   * Gets permissibles
   * @param query Query data for searching permissibles
   */
  searchPermissible(query?: { name?: string; page?: number; pageSize?: number }): Promise<IPageResult<IPermissible>>;
  /**
   * Add a batch set of users to a role
   * @param id Id of role to add
   * @param model Data to add to role
   */
  addUsers(id: string, model: IBatchRoleAdd): Promise<void>;
  /**
   * Remove a batch set of users to a role
   * @param id Id of role to remove
   * @param model Data to add to remove
   */
  removeUsers(id: string, model: IBatchRoleRemove): Promise<void>;
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
  /**
   * Update security questions for user
   * @param questionUpdate Questions to be updated for user
   */
  updateSecurityQuestion(questionUpdate: ISecurityQuestionUpdate): Promise<void>;
  /**
   * Gets a user
   * @param id Id of user to retrieve
   */
  get(id: string): Promise<IUser>;
  /**
   * Gets users
   * @param query Query data to search a user
   */
  search(query?: {
    name?: string | undefined;
    roleId?: string | undefined;
    orderBy?: any | undefined;
    activeOnly?: boolean | undefined;
    page?: number | undefined;
    pageSize?: number | undefined;
  }): Promise<IPageResult<IUser>>;
  /**
   * Creates a user
   * @param model User data to create
   */
  create(model: INewUser): Promise<IUser>;
  /**
   * Updates a user
   * @param id Id of user to update
   * @param model User data to update
   */
  update(id: string, model: IUser): Promise<IUser>;
  /**
   * Delete a user
   * @param id Id of user to delete
   */
  delete(id: string): Promise<void>;
  /**
   * Replace a users questions
   * @param id Id of user to update
   * @param questionUpdate Question data to update
   */
  updateUserSecurityQuestion(id: string, questionUpdate: ISecurityQuestionUpdate): Promise<void>;
}

/**
 * Defines Mesh Data
 */
export interface IMeshData {
  /**
   * System field representing the id of an item
   */
  _id?: string | undefined;
}
/**
 * Defines User Role Add
 */
export interface IUserRoleAdd {
  /**
   * Id representing a user
   */
  id: string;
}
/**
 * Defines batch operation for users to be added to role
 */
export interface IBatchRoleAdd {
  /**
   * Collection of users to be added to role
   */
  users: IUserRoleAdd[];
}
/**
 * Defines User Role Remove
 */
export interface IUserRoleRemove {
  /**
   * Id representing a user
   */
  id: string;
}
/**
 * Defines batch operation for users to be added to role
 */
export interface IBatchRoleRemove {
  /**
   * Collection of users to be removed from role
   */
  users: IUserRoleRemove[];
}
/**
 * Defines permissible
 */
export interface IPermissible {
  /**
   * Name of permissible
   */
  name: string;
  /**
   * Identifies if the permissible can be created
   */
  canCreate: boolean;
  /**
   * Identifies if the permissible can be updated
   */
  canUpdate: boolean;
  /**
   * Identifies if the permissible can be read
   */
  canRead: boolean;
  /**
   * Identifies if the permissible can be deleted
   */
  canDelete: boolean;
}
/**
 * Defines a permission
 */
export interface IPermission {
  /**
   * Id of permission
   */
  id: string;
  /**
   * Name of permissible
   */
  permissibleName: string;
  /**
   * Identifies if the role can perform create
   */
  create: boolean;
  /**
   * Identifies if the role can perform update
   */
  update: boolean;
  /**
   * Identifies if the role can perform read
   */
  read: boolean;
  /**
   * Identifies if the role can perform delete
   */
  delete: boolean;
}
/**
 * Defines Role
 */
export interface IRole {
  /**
   * Id representing a role
   */
  id: string;
  /**
   * Name of the role
   */
  name: string;
  /**
   * Description of the role
   */
  description: string;
  /**
   * Number of users currently assigned to the role
   */
  numberOfUsers: number;
}
/**
 * Defines User Role
 */
export interface IUserRole {
  /**
   * Name of the role
   */
  name: string;
  /**
   * Identifies when the role was added
   */
  addedDate: Date;
}

/**
 * Defines new user
 */
export interface INewUser {
  /**
   * Name representing a user
   */
  username: string;
  /**
   * Optional field for first name
   */
  firstName?: string | null | undefined;
  /**
   * Optional field for last name
   */
  lastName?: string | null | undefined;
  /**
   * Optional field for phone number
   */
  phoneNumber?: string | null | undefined;
  /**
   * Optional field for email address
   */
  emailAddress?: string | null | undefined;
  /**
   * New password for user
   */
  newPassword: string;
  /**
   * Collection identifying security questions for user verification
   */
  securityQuestions?: ISecurityQuestion[] | null | undefined;
  /**
   * Identifies if a user has been verified
   */
  verified: boolean;
  /**
   * Identifies if a user is considered active
   */
  isActive: boolean;
  /**
   * Optional field defining a users set of roles
   */
  roles?: IUserRole[] | null | undefined;
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
  firstName?: string | null | undefined;
  /**
   * Optional field for last name
   */
  lastName?: string | null | undefined;
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
  phoneNumber?: string | null | undefined;
  /**
   * Optional field defining a users set of roles
   */
  roles: IUserRole[] | undefined;
  /**
   * Collection identifying security questions for user verification
   */
  securityQuestions?: ISecurityQuestionHash[];
  /**
   * Identifies if user is considered to be anonymous
   */
  anonymous: boolean;
  /**
   * Optional field for email address
   */
  emailAddress?: string | null | undefined;
  /**
   * Identifies when user last accessed the system
   */
  lastAccessed?: Date | null;
}

/**
 * Defines a new user
 */
export interface IRegisterUser {
  /**
   * Name representing a user
   */
  username: string;
  /**
   * New password for user
   */
  newPassword: string;
  /**
   * Optional field for first name
   */
  firstName?: string | null | undefined;
  /**
   * Optional field for last name
   */
  lastName?: string | null | undefined;
  /**
   * Optional field for phone number
   */
  phoneNumber?: string | null;
  /**
   * Email address for user
   */
  emailAddress?: string | null | undefined;
  /**
   * Collection identifying security questions for user verification
   */
  securityQuestions?: ISecurityQuestion[];
}

/**
 * Defines Security Question with answer hash
 */
export interface ISecurityQuestionHash {
  /**
   * Question hint for user verification
   */
  question: string;
  /**
   * Answer hash to question for verification
   */
  answerHash: string;
}
/**
 * Defines Security Question with answer text
 */
export interface ISecurityQuestion {
  /**
   * Question hint for user verification
   */
  question: string;
  /**
   * Answer to question for verification
   */
  answer: string;
}
/**
 * Defines Security Questions to be updated for user
 */
export interface ISecurityQuestionUpdate {
  /**
   * Collection of questions and answers to be used for verification
   */
  securityQuestions: ISecurityQuestion[];
}
/**
 * Defines a user verification hash request
 */
export interface IUserVerificationHash {
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
  /**
   * Hint for request to help the user recognize the request
   */
  hint: string;
  /**
   * Attempt number for request hint.
   */
  attempt: number;
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

/**
 * Defines a user verification check
 */
export interface IUserVerificationCheck extends IUserVerificationHash {
  /**
   * Verification code for hash parity
   */
  verificationCode: string;
}

/**
 * Defines a password reset for a user
 */
export interface IResetPassword extends IUserVerificationCheck {
  /**
   * New password for user to be set
   */
  newPassword: string;
}

/**
 * Defines if an item exists
 */
export interface IExist {
  /**
   * Identifies if an item exists
   */
  exists: boolean;
}

/**
 * Defines if an item is valid
 */
export interface IValid {
  /**
   * Identifies if an item is valid
   */
  isValid: boolean;
}

/**
 * Defines currently authorized user
 */
export interface ICurrentUser {
  /**
   * User's first name
   */
  firstName: string;
  /**
   * User's last name
   */
  lastName: string;
  /**
   * Collection of roles user has defined
   */
  roles: string[];
  /**
   * User's id
   */
  id: string;
  /**
   * Unique identifier of anonymous user, such as a device id
   */
  username: string;
  /**
   * User's permissions
   */
  permissions: string[];
}
