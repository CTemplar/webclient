// Angular
import { AppConfig } from '../../environments/environment';
import { NgModule } from '@angular/core';

// Third-party
import { EffectsModule } from '@ngrx/effects';
import { RouterStateSerializer, StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreModule } from '@ngrx/store';

// ??
import { CustomSerializer, effects, reducers } from './index';
import { logoutReducer } from './reducers/auth.reducers';

@NgModule({
  imports: [
    EffectsModule.forRoot(effects),
    StoreDevtoolsModule.instrument({ maxAge: 50, logOnly: AppConfig.debug }),
    StoreModule.forRoot(reducers, { metaReducers: [logoutReducer] }),
    StoreRouterConnectingModule.forRoot()
  ],
  providers: [
    { provide: RouterStateSerializer, useClass: CustomSerializer },
  ]
})

export class AppStoreModule {
}
