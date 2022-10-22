import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { catchError, map, switchMap, tap } from "rxjs/operators";
import { environment } from "src/environments/environment";
import * as AuthActions from './auth.actions';

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
    // Nos permite crear un nuevo observable cogiendo los datos de otro observable
    switchMap((authData: AuthActions.LoginStart) => {
      return this.http.post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.firebaseAPIKey,
        {
          email: authData.payload.email,
          password: authData.payload.password,
          returnSecureToken: true
        }
      )
      .pipe(
        map(resData => {
          const expirationDate = new Date(new Date().getTime() + +resData.expiresIn * 1000);
          return new AuthActions.Login({ 
            email: resData.email,
            userId: resData.localId,
            token: resData.idToken,
            expirationDate: expirationDate
          });
        }),
        catchError(errorRes => {
          let errorMessage = 'An unknown error occurred.';
          if (!errorRes.error || !errorRes.error.error) {
            return of(new AuthActions.LoginFail(errorMessage));
          }
          switch (errorRes.error.error.message) {
            case 'EMAIL_EXISTS':
              errorMessage = 'This email exists already.';
              break;
            case 'EMAIL_NOT_FOUND':
              errorMessage = 'This email does not exists.';
              break;
            case 'INVALID_PASSWORD':
              errorMessage = 'This password is not correct.';
              break;
          }
          return of(new AuthActions.LoginFail(errorMessage));
        })
      );
    }),
  );

  /* Todos los efectos ejecutan una acción al final, pero hay casos como este en los que no hace falta, 
     para ello se pone el objeto dispatch */
  @Effect({ dispatch: false })
  authSuccess = this.actions$.pipe(
    ofType(AuthActions.LOGIN),
    tap(() => {
      this.router.navigate(['/']);
    })
  )

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router) {}
}