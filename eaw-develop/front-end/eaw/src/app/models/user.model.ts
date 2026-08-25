/**
 * Class credentials to login
 */
export class LoginModel {
  public email: string;
  public password: string;
}

/**
 * Class verify email
 */
export class VerifyEmail {
  public email: string;
}

/**
 * Class contact email
 */
export class ContactEmail {
  public name: string;
  public company: string;
  public telephone: string;
  public email: string;
  public message: string;
}

/**
 * Class change password
 */
export class ChangePassword {
  public accessToken: string;
  public newPassword: string;
}

/**
 * Class User
 */

class User {
  public id: number;
  public firstName: string;
  public lastName: string;
  public email: string;
  public password: string;
  public roleTypesId: number;
  public realm: string;
  public username: string;
  public emailVerified: boolean;
  public verificationToken: string;
  public isDeleted: boolean;
  public telephone: string;
  public languagesId: number;
  public sex: number;
  public isActive: boolean;
  public createdBy: number;
  public createdAt: Date;
  public updatedBy: number;
  public updatedAt: Date;
  public userToken: string;
  public deletionJustification: string;

  /**
   * User constructor
   * @param firstName
   * @param lastName
   * @param email
   * @param password
   * @param roleTypesId
   * @param realm
   * @param username
   * @param emailVerified
   * @param verificationToken
   * @param isDeleted
   * @param telephone
   * @param languageId
   * @param sex
   * @param isActive
   * @param createdBy
   * @param createdAt
   * @param deletionJustification
   */
  constructor(
    firstName: string = null,
    lastName: string = null,
    email: string = null,
    password: string = null,
    roleTypesId: number = null,
    realm: string = null,
    username: string = null,
    emailVerified: boolean = null,
    verificationToken: string = null,
    isDeleted: boolean = null,
    telephone: string = null,
    languageId: number = null,
    sex: number = null,
    isActive: boolean = null,
    createdBy: number = null,
    createdAt: Date = null,
    userToken: string = '',
    deletionJustification: string = null,
  ) {
    this.id = 0;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.password = password;
    this.roleTypesId = roleTypesId;
    this.realm = realm;
    this.username = username;
    this.emailVerified = emailVerified;
    this.verificationToken = verificationToken;
    this.isDeleted = isDeleted;
    this.telephone = telephone;
    this.languagesId = languageId;
    this.sex = sex;
    this.isActive = isActive;
    this.createdBy = createdBy;
    this.createdAt = createdAt;
    this.userToken = userToken;
    this.deletionJustification = deletionJustification;
  }
}
export {User};
