import {Actions, Effect, ofType} from "@ngrx/effects";

import * as AuthActions from '../store/auth.actions';
import {AuthenticateFail, AuthenticateSuccess, IAuthData, LogoutAction} from '../store/auth.actions';
import {catchError, map, switchMap, tap} from "rxjs/operators";
import {environment} from "../../../environments/environment";
import { AuthService} from "../auth.service";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {of} from "rxjs";
import {Injectable} from "@angular/core";
import {Router} from "@angular/router";
import {User} from "../user.model";

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  redirect: boolean;
  registered?: boolean;
}

const handleAuthentication = (loginData: AuthResponseData): AuthenticateSuccess => {
  const expirationDate = new Date(new Date().getTime() + +loginData.expiresIn * 1000);
  const user = new User(loginData.email, loginData.localId, loginData.idToken, expirationDate);
  localStorage.setItem('userData', JSON.stringify(user));
  return new AuthActions.AuthenticateSuccess({
    email: loginData.email,
    userId: loginData.localId,
    token: loginData.idToken,
    expirationDate,
    redirect: true
  });
};

@Injectable()
export class AuthEffects {

  @Effect()
  authSignUp = this.actions$.pipe(
    ofType(AuthActions.SIGN_UP),
    switchMap((data: IAuthData) => {
      return this.http
        .post<AuthResponseData>(
          'https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=' + environment.firebaseAPIKey,
          {
            email: data.email,
            password: data.password,
            returnSecureToken: true
          }
        ).pipe(
          tap((resData) => {
            this.authService.registerLogoutTimer(+resData.expiresIn * 1000);
          }),
          map((loginData) => handleAuthentication(loginData)),
          catchError((errorRes: HttpErrorResponse) => {
            return this.handleError(errorRes);
          })
        );
    })
  );

  @Effect()
  authLogin = this.actions$.pipe(
    ofType(AuthActions.LOGIN_START),
    switchMap((authDate: AuthActions.LoginStart) => {
      return this.http
        .post<AuthResponseData>(
          'https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=' + environment.firebaseAPIKey,
          {
            email: authDate.payload.email,
            password: authDate.payload.password,
            returnSecureToken: true
          }
        ).pipe(
          tap((resData) => {
            this.authService.registerLogoutTimer(+resData.expiresIn * 1000);
          }),
          map((loginData) => handleAuthentication(loginData)),
          catchError((errorRes: HttpErrorResponse) => {
            return this.handleError(errorRes);
          })
        );
    })
  );

  @Effect({ dispatch: false })
  authRedirect = this.actions$.pipe(
    ofType(AuthActions.AUTHENTICATE_SUCCESS),
    tap(action => {
      if (action['payload']) {
        const payload = action['payload'] as AuthResponseData;
        if (payload.redirect) {
          this.router.navigate(['/']);
        }
      }
    })
  );

  @Effect()
  authAutoLogin = this.actions$.pipe(
    ofType(AuthActions.AUTO_LOGIN),
    map(data => {
      const userData: {
        email: string;
        id: string;
        _token: string;
        _tokenExpirationDate: string;
      } = JSON.parse(localStorage.getItem('userData'));
      if (!userData) {
        return new AuthenticateFail("Can't parse data about user");
      }

      const loadedUser = new User(
        userData.email,
        userData.id,
        userData._token,
        new Date(userData._tokenExpirationDate)
      );

      if (userData._token) {
        // register logout timer
        const expirationDuration =
          new Date(userData._tokenExpirationDate).getTime() -
          new Date().getTime();
        this.authService.registerLogoutTimer(expirationDuration);

        return new AuthActions.AuthenticateSuccess({
          email: loadedUser.email,
          userId: loadedUser.id,
          token: loadedUser.token,
          expirationDate: new Date(userData._tokenExpirationDate),
          redirect: true
        });
      }
      return { type: 'DUMMY' };
    })
  );

  @Effect({ dispatch: false })
  authLogout = this.actions$.pipe(
    ofType(AuthActions.LOGOUT),
    tap(() => {
      localStorage.removeItem('userData');
      this.authService.clearLogoutTimer();
      this.router.navigate(['/auth']);
    })
  );

  handleError = (errorRes: HttpErrorResponse) => {
    let errorMessage = 'An unknown error occurred!';
    if (!errorRes.error || !errorRes.error.error) {
      return of(new AuthenticateFail(errorMessage));
    }
    switch (errorRes.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'This email exists already';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'This email does not exist.';
        break;
      case 'INVALID_PASSWORD':
        errorMessage = 'This password is not correct.';
        break;
    }
    return of(new AuthenticateFail(errorMessage));
  }

  constructor(private actions$: Actions, private http: HttpClient, private router: Router, private authService: AuthService) {

  }
}
