import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';

import {Store} from "@ngrx/store";
import * as fromApp from '../store/app.reducer';

import {map} from 'rxjs/operators';
import * as AuthActions from "../auth/store/auth.actions";
import * as RecipesActions from "../recipes/store/recipe.actions";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  private userSub: Subscription;

  constructor(
    private store: Store<fromApp.AppState>
  ) {}

  ngOnInit() {
    this.userSub = this.store.select('auth')
      .pipe(
        map(userState => userState.user)
      ).subscribe(user => {
      this.isAuthenticated = !!user;
    });
  }

  onSaveData() {
    this.store.dispatch(new RecipesActions.StoreRecipes());
  }

  onFetchData() {
    this.store.dispatch(new RecipesActions.FetchRecipes());
  }

  onLogout() {
    this.store.dispatch(new AuthActions.LogoutAction());
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }
}
