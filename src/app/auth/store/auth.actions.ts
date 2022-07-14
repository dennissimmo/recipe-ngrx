import { Action } from "@ngrx/store";

export const LOGIN_START = "[Auth] Login Start";
export const LOGIN = '[Auth] Login';
export const LOGOUT = '[Auth] Logout';
export const SIGN_UP = '[Auth] Sign Up';

export interface IAuthData {
  email: string;
  password: string;
}

export class LoginStart implements Action {
  readonly type = LOGIN_START;
  constructor(public payload: IAuthData) {

  }
}

export class LoginAction implements Action {
  readonly type = LOGIN;
  constructor(public payload?: { email: string,
    userId: string,
    token: string,
    expirationDate: Date
  } ) {
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


export type AuthActions = LoginAction | SignUpAction | LogoutAction;
