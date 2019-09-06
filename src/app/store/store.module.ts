// Ngrx
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { NgModule } from '@angular/core';
import { RouterStateSerializer, StoreRouterConnectingModule } from '@ngrx/router-store';
import { logoutReducer } from './reducers/auth.reducers';
// Environment
import { environment } from '../../environments/environment';
// Reducers
import { CustomSerializer, effects, reducers } from './index';


@NgModule({
  imports: [
    StoreModule.forRoot(reducers, { metaReducers: [logoutReducer] }),
    EffectsModule.forRoot(effects),
    StoreDevtoolsModule.instrument({
      maxAge: 50,
      logOnly: environment.debug
    }),
    StoreRouterConnectingModule.forRoot()
  ],
  providers: [
    {
      provide: RouterStateSerializer,
      useClass: CustomSerializer
    }
  ]
})

export class AppStoreModule {
}
