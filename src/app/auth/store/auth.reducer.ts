import {User} from "../user.model";
import * as AuthActions from "./auth.actions";

const initialState: State = {
  user: null,
  errorMessage: null,
  isLoading: false
};

export interface State {
  user: User;
  errorMessage: string;
  isLoading: boolean;
}

export function authReducer(state = initialState, action: AuthActions.AuthActions): State {
  switch (action.type) {
    case AuthActions.AUTHENTICATE_SUCCESS:
      const user = new User(
        action.payload.email,
        action.payload.userId,
        action.payload.token,
        action.payload.expirationDate
      );
      return {
        ...state,
        user,
        isLoading: false
      };
    case AuthActions.LOGIN_START:
    case AuthActions.SIGN_UP:
      return {
        ...state,
        isLoading: true,
        errorMessage: null
      };
    case AuthActions.AUTHENTICATE_FAIL:
      return {
        ...state,
        user: null,
        isLoading: false,
        errorMessage: action.payload
      };
    case AuthActions.LOGOUT:
      return {
        ...state,
        user: null
      };
    case AuthActions.HANDLE_ERROR:
      return {
        ...state,
        errorMessage: null
      };
    default:
      return state;
  }
}
