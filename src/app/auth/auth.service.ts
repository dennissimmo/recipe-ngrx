import {Injectable} from '@angular/core';
import * as fromApp from '../store/app.reducer';
import {Store} from "@ngrx/store";
import {LogoutAction} from '../auth/store/auth.actions';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokenExpirationTimer: any;

  constructor(
    private store: Store<fromApp.AppState>
  ) {}

  registerLogoutTimer(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.store.dispatch(new LogoutAction());
    }, expirationDuration);
  }

  clearLogoutTimer() {
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }
}
