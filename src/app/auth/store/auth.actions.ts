import {Action} from "@ngrx/store";

export const LOGIN_START = "[Auth] Login Start";
export const AUTHENTICATE_SUCCESS = '[Auth] Login';
export const AUTHENTICATE_FAIL = '[Auth] Login Fail';
export const AUTO_LOGIN = '[Auth] Auto Login';
export const LOGOUT = '[Auth] Logout';
export const SIGN_UP = '[Auth] Sign Up';
export const HANDLE_ERROR = '[Auth] Handle Error';

export interface IAuthData {
  email: string;
  password: string;
}

export class LoginStart implements Action {
  readonly type = LOGIN_START;

  constructor(public payload: IAuthData) {

  }
}

export class AuthenticateSuccess implements Action {
  readonly type = AUTHENTICATE_SUCCESS;

  constructor(public payload: {
    email: string,
    userId: string,
    token: string,
    expirationDate: Date,
    redirect: boolean
  }) {
  }
}

export class LogoutAction implements Action {
  readonly type = LOGOUT;
  payload?: any;
}

export class SignUpAction implements Action {
  readonly type = SIGN_UP;
  payload?: IAuthData;
}

export class AuthenticateFail implements Action {
  readonly type = AUTHENTICATE_FAIL;

  constructor(public payload: string) {
  }
}

export class HandleError implements Action {
  readonly type = HANDLE_ERROR;
}

export class AutoLogin implements Action {
  readonly type = AUTO_LOGIN;
  payload?: any;
}

export type AuthActions = SignUpAction | LogoutAction | LoginStart | AuthenticateSuccess | AuthenticateFail | HandleError | AutoLogin;
