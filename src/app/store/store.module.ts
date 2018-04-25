import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule, ActionReducerMap, ActionReducer, MetaReducer } from '@ngrx/store';
import { NgModule } from '@angular/core';
import { storeFreeze } from 'ngrx-store-freeze';
import { environment } from '../../environments/environment';
import { RouterStateSerializer, StoreRouterConnectingModule } from '@ngrx/router-store';
import { reducers, effects, CustomSerializer } from './index';

import { AppState } from './datatypes';

// export const metaReducers: MetaReducer<any>[] = !environment.production
//     ? [storeFreeze]
//     : [];

export function logger(reducer: ActionReducer<AppState>): ActionReducer<AppState> {
    return function(state: AppState, action: any): AppState {
      console.log('action', action);
      console.log('state', state);
      return reducer(state, action);
    };
  }

  export const metaReducers: MetaReducer<AppState>[] = [logger];

@NgModule({
    imports  : [
        StoreModule.forRoot(reducers, {metaReducers}),
        EffectsModule.forRoot(effects),
        !environment.production ? StoreDevtoolsModule.instrument() : [],
        StoreRouterConnectingModule
    ],
    providers: [
        {
            provide : RouterStateSerializer,
            useClass: CustomSerializer
        }
    ]
})

export class AppStoreModule { }
