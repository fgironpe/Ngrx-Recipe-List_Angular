import { HttpEvent, HttpHandler, HttpInterceptor, HttpParams, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { exhaustMap, map, take } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private store: Store<fromApp.AppState>) {
  }

  intercept( req: HttpRequest<any>, next: HttpHandler ): Observable<HttpEvent<any>> {
    return this.store.select('auth').pipe(
      // Take: Te permite coger el número de valores de la suscripción que le pasas por parámetro y luego de desuscribe.
      take(1),
      // Este map recupera del store el user para poder utilizarlo en los demás operators.
      map(authState => {
        return authState.user;
      }),
      /*
      * Espera a que el primer observable termine y después coge el valor del observable anterior y devuelve un nuevo
      * observable que reemplaza el primer observable.
      * */
      exhaustMap(user => {
        if (!user) {
          return next.handle(req);
        }
        const modifiedRequest = req.clone({
          params: new HttpParams().set('auth', user.token)
        });
        return next.handle(modifiedRequest);
      })
    );
  }
}
