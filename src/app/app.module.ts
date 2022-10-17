import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core.module';
import { StoreModule } from '@ngrx/store';
import { SharedModule } from './shared/shared.module';
import * as fromApp from './store/app.reducer';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    StoreModule.forRoot(fromApp.appReducer),
    SharedModule,
    CoreModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
