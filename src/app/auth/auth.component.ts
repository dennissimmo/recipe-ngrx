import {AfterViewInit, Component, ComponentFactoryResolver, OnDestroy, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Subscription} from 'rxjs';
import {AlertComponent} from '../shared/alert/alert.component';
import {PlaceholderDirective} from '../shared/placeholder/placeholder.directive';

import * as fromApp from "../store/app.reducer";
import * as fromAuth from "../auth/store/auth.reducer";
import * as AuthActions from "../auth/store/auth.actions";
import {HandleError} from "../auth/store/auth.actions";
import {Store} from "@ngrx/store";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html'
})
export class AuthComponent implements AfterViewInit, OnDestroy {
  isLoginMode = true;
  isLoading = false;
  error: string = null;
  @ViewChild(PlaceholderDirective, { static: false }) alertHost: PlaceholderDirective;

  private closeSub: Subscription;
  private storeSub: Subscription;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private store: Store<fromApp.AppState>
  ) {}

  ngAfterViewInit() {
    this.storeSub = this.store.select('auth').subscribe((authState: fromAuth.State) => {
      this.isLoading = authState.isLoading;
      this.error = authState.errorMessage;
      if (this.error) {
        this.showErrorAlert(this.error);
      }
    });
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;
    this.isLoading = true;

    if (this.isLoginMode) {
      this.store.dispatch(new AuthActions.LoginStart({
        email,
        password
      }));
    } else {
      // this.store.dispatch(new AuthActions.SignUpAction({
      //   email,
      //   password
      // }));
    }
    form.reset();
  }

  onHandleError() {
    this.store.dispatch(new HandleError());
  }

  ngOnDestroy() {
    if (this.closeSub) {
      this.closeSub.unsubscribe();
    }

    if (this.storeSub) {
      this.storeSub.unsubscribe();
    }
  }

  private showErrorAlert(message: string) {
    // const alertCmp = new AlertComponent();
    const alertCmpFactory = this.componentFactoryResolver.resolveComponentFactory(
      AlertComponent
    );
    const hostViewContainerRef = this.alertHost.viewContainerRef;
    hostViewContainerRef.clear();

    const componentRef = hostViewContainerRef.createComponent(alertCmpFactory);

    componentRef.instance.message = message;
    this.closeSub = componentRef.instance.close.subscribe(() => {
      this.closeSub.unsubscribe();
      hostViewContainerRef.clear();
    });
  }
}
