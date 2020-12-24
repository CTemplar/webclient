import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { RouterStateSerializer, StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreModule, ActionReducer, MetaReducer, INIT } from '@ngrx/store';
import { localStorageSync } from 'ngrx-store-localstorage';

import { AppConfig } from '../../environments/environment';

import { logoutReducer } from './reducers/auth.reducers';

import { CustomSerializer, effects, reducers } from '.';

import { REMEMBER_ME, SYNC_DATA_WITH_STORE } from '../shared/config';

import { MailActionTypes } from '../store/actions/mail.actions';

export function localStorageSyncReducer(reducer: ActionReducer<any>): ActionReducer<any> {
  return function(state, action) {
    const nextState = reducer(state, action);
    
    if (
      action.type === MailActionTypes.UPDATE_PGP_DECRYPTED_CONTENT && 
      action['payload'].isDecryptingAllSubjects && 
      !action['payload'].isPGPInProgress) {

      const isNeedSync = localStorage.getItem(SYNC_DATA_WITH_STORE) === 'true' ? true : false;
      if (isNeedSync) {
        const isRememberMe = localStorage.getItem(REMEMBER_ME) === 'true' ? true : false;
        const strDecryptedSubjects = JSON.stringify({ decryptedSubjects: nextState.mail.decryptedSubjects });
        if (isRememberMe) {
          localStorage.setItem('ctemplar_mail', strDecryptedSubjects);
        } else {
          sessionStorage.setItem('ctemplar_mail', strDecryptedSubjects);
        }
      }
    }
 
    return nextState;
  }
}

export function rehydrateMetaReducer(reducer: ActionReducer<any>): ActionReducer<any> {
  
  return function(state, action) {
    const nextState = reducer(state, action);
    if (action.type === INIT) {
      const isNeedSync = localStorage.getItem(SYNC_DATA_WITH_STORE) === 'true' ? true : false;
      const isRememberMe = localStorage.getItem(REMEMBER_ME) === 'true' ? true : false;
      if (isNeedSync) {
        const storageValue = localStorage.getItem("ctemplar_mail");
        try {
          const parsedStorageValue = JSON.parse(storageValue);
          if (parsedStorageValue && parsedStorageValue['decryptedSubjects']) {
            const retVal = {...nextState, mail: {...nextState.mail, ...parsedStorageValue}}
            return retVal;
          }
        } catch {
          if (isRememberMe) {
            localStorage.removeItem("ctemplar_mail");
          } else {
            sessionStorage.removeItem("ctemplar_mail");
          }
        }
      } else {
        if (isRememberMe) {
          localStorage.removeItem("ctemplar_mail");
        } else {
          sessionStorage.removeItem("ctemplar_mail");
        }
      }
    }
 
    return nextState;
  };
}

const metaReducers: Array<MetaReducer<any, any>> = [rehydrateMetaReducer, localStorageSyncReducer, logoutReducer];
@NgModule({
  imports: [
    EffectsModule.forRoot(effects),
    StoreModule.forRoot(reducers, { metaReducers }),
    StoreDevtoolsModule.instrument({ maxAge: 100, logOnly: AppConfig.production }),
    StoreRouterConnectingModule.forRoot(),
  ],
  providers: [{ provide: RouterStateSerializer, useClass: CustomSerializer }],
})
export class AppStoreModule {}
