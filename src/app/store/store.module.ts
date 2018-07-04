// Ngrx
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule, ActionReducerMap, ActionReducer, MetaReducer } from '@ngrx/store';
import { NgModule } from '@angular/core';
import { storeFreeze } from 'ngrx-store-freeze';
import { RouterStateSerializer, StoreRouterConnectingModule } from '@ngrx/router-store';
import { logoutReducer} from './reducers/auth.reducers';
// Environment
import { environment } from '../../environments/environment';

// Reducers
import { reducers, effects, CustomSerializer } from './index';

// Model
import { AppState } from './datatypes';

// export const metaReducers: MetaReducer<any>[] = !environment.production
//     ? [storeFreeze]
//     : [];

export function logger(reducer: ActionReducer<AppState>): ActionReducer<AppState> {
  return function (state: AppState, action: any): AppState {
    console.log('action', action);
    console.log('state', state);
    return reducer(state, action);
  };
}


@NgModule({
  imports: [
    StoreModule.forRoot(reducers, { metaReducers: [logoutReducer, logger] }),
    EffectsModule.forRoot(effects),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
    StoreRouterConnectingModule
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
