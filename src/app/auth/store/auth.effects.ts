import {Actions, Effect, ofType} from "@ngrx/effects";

import * as AuthActions from '../store/auth.actions';
import {catchError, switchMap, map } from "rxjs/operators";
import {environment} from "../../../environments/environment";
import {AuthResponseData} from "../auth.service";
import {HttpClient} from "@angular/common/http";
import {of} from "rxjs";
import {Injectable} from "@angular/core";

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable()
export class AuthEffects {

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
          map((loginData) => {
            const expirationDate = new Date(new Date().getTime() + +loginData.expiresIn * 1000);
            of(new AuthActions.LoginAction({
              email: loginData.email,
              userId: loginData.localId,
              token: loginData.idToken,
              expirationDate
            }));
          }),
          catchError(error => {
            return of();
          })
        );
    })
  );

  constructor(private actions$: Actions, private http: HttpClient) {

  }
}
