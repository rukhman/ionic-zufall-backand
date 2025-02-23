export enum E_Gender {
  Male = 'male',
  Female = 'female',
}

// export enum E_Role {
//   Admin,
//   Developer,
//   Employee,
//   User,
// }

export enum E_AuthService {
  Google = 'google',
  Yandex = 'yandex',
}

export enum E_ResponseTypes {
  'ok',
  'error',
}

export interface IYandexResponse {
  access_token: string;
  token_type: string;
  expires_in: string;
  cid: string;
  extraData: {
    flag: boolean;
  };
}

// export enum E_Gender {
//   'Male',
//   'Female',
// }

export class UserProfile {
  authId: number;
  firstName: string;
  secondName: string;
  fullName: string;
  email: string;
  avatarId?: string;
  phone?: string;
  birthDate?: string;
  gender?: E_Gender;
  authService: E_AuthService;

  constructor({
    authId,
    firstName,
    secondName,
    fullName,
    email,
    avatarId,
    phone,
    birthDate,
    gender,
    authService,
  }: {
    authId: number;
    firstName: string;
    secondName: string;
    fullName: string;
    email: string;
    avatarId?: string;
    phone?: string;
    birthDate?: string;
    gender?: E_Gender;
    authService: E_AuthService;
  }) {
    this.authId = authId;
    this.firstName = firstName;
    this.secondName = secondName;
    this.fullName = fullName;
    this.email = email;
    this.avatarId = avatarId;
    this.phone = phone;
    this.birthDate = birthDate;
    this.gender = gender;
    this.authService = authService;
  }
}
export interface I_IdNameDesc {
  id: number;
  name: string;
  description: string;
}

export interface UserProfileExt {
  roles: I_IdNameDesc[];
  permissions: I_IdNameDesc[];
}

export type UserProfileFull = UserProfile & UserProfileExt;

export interface IYandexResponseUserData {
  iat: number;
  jti: string;
  exp: number;
  iss: string;
  uid: number;
  login: string;
  psuid: string;
  name: string;
  email: string;
  birthday: string;
  gender: string;
  display_name: string;
  avatar_id: string;
  phone: Phone;
}

interface Phone {
  id: number;
  number: string;
}

export enum EYandexPhotoSizes {
  '28x28' = 'islands-small',
  '34x34' = 'islands-34',
  '42x42' = 'islands-middle',
  '50x50' = 'islands-50',
  '56x56' = 'islands-retina-small',
  '68x68' = 'islands-68',
  '75x75' = 'islands-75',
  '84x84' = 'islands-retina-middle',
  '100x100' = 'islands-retina-50',
  '200x200' = 'islands-200',
}

export class ShortUser {
  authService: E_AuthService;
  authId: string;
  role: string;

  constructor({ authService, authId, role }: { authService: E_AuthService; authId: string; role: string }) {
    this.authService = authService;
    this.authId = authId;
    this.role = role;
  }
}

export class GoogleUserDto {
  /**
   * The unique identifier for the user.
   */
  id: string;
  /**
   * The email address associated with the user.
   */
  email: string;
  /**
   * The user's full name.
   */
  name: string;
  /**
   * The family name (last name) of the user.
   */
  familyName: string;
  /**
   * The given name (first name) of the user.
   */
  givenName: string;
  /**
   * The URL of the user's profile picture.
   */
  imageUrl: string;
  /**
   * The server authentication code.
   */
  serverAuthCode: string;
  /**
   * The authentication details including access, refresh and ID tokens.
   */
  authentication: Authentication;
}

export interface Authentication {
  /**
   * The access token obtained during authentication.
   */
  accessToken: string;
  /**
   * The ID token obtained during authentication.
   */
  idToken: string;
  /**
   * The refresh token.
   * @warning This property is applicable only for mobile platforms (iOS and Android).
   */
  refreshToken?: string;
}
