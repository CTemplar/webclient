import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { DefaultRouterStateSerializer, RouterStateSerializer, StoreRouterConnectingModule } from '@ngrx/router-store';
import { ActionReducer, INIT, MetaReducer, StoreModule } from '@ngrx/store';

import { REMEMBER_ME, SYNC_DATA_WITH_STORE } from '../shared/config';

import { logoutReducer } from './reducers/auth.reducers';
import { MailActionTypes } from './actions';

import { CustomSerializer, effects, reducers } from '.';

export function localStorageSyncReducer(reducer: ActionReducer<any>): ActionReducer<any> {
  return (state, action: any) => {
    const nextState = reducer(state, action);

    if (
      action.type === MailActionTypes.UPDATE_PGP_DECRYPTED_CONTENT &&
      action.payload.isDecryptingAllSubjects &&
      !action.payload.isPGPInProgress
    ) {
      const isNeedSync = localStorage.getItem(SYNC_DATA_WITH_STORE) === 'true';
      if (isNeedSync) {
        const isRememberMe = localStorage.getItem(REMEMBER_ME) === 'true';
        const stringDecryptedSubjects = JSON.stringify({ decryptedSubjects: nextState.mail.decryptedSubjects });
        if (isRememberMe) {
          localStorage.setItem('ctemplar_mail', stringDecryptedSubjects);
        } else {
          sessionStorage.setItem('ctemplar_mail', stringDecryptedSubjects);
        }
      }
    }
    return nextState;
  };
}

export function rehydrateMetaReducer(reducer: ActionReducer<any>): ActionReducer<any> {
  return (state, action) => {
    const nextState = reducer(state, action);
    if (action.type === INIT) {
      const isNeedSync = localStorage.getItem(SYNC_DATA_WITH_STORE) === 'true';
      const isRememberMe = localStorage.getItem(REMEMBER_ME) === 'true';
      if (isNeedSync) {
        const storageValue = isRememberMe
          ? localStorage.getItem('ctemplar_mail')
          : sessionStorage.getItem('ctemplar_mail');
        try {
          const parsedStorageValue = JSON.parse(storageValue);
          if (parsedStorageValue && parsedStorageValue.decryptedSubjects) {
            return { ...nextState, mail: { ...nextState.mail, ...parsedStorageValue } };
          }
        } catch {
          if (isRememberMe) {
            localStorage.removeItem('ctemplar_mail');
          } else {
            sessionStorage.removeItem('ctemplar_mail');
          }
        }
      } else if (isRememberMe) {
        localStorage.removeItem('ctemplar_mail');
      } else {
        sessionStorage.removeItem('ctemplar_mail');
      }
    }

    return nextState;
  };
}

const metaReducers: MetaReducer<any>[] = [logoutReducer, rehydrateMetaReducer, localStorageSyncReducer];
@NgModule({
  imports: [
    EffectsModule.forRoot(effects),
    StoreModule.forRoot(reducers, {
      metaReducers,
      runtimeChecks: {
        strictStateImmutability: false,
        strictActionImmutability: false,
      },
    }),
    // StoreDevtoolsModule.instrument({ maxAge: 100, logOnly: AppConfig.production }),
    StoreRouterConnectingModule.forRoot({ serializer: DefaultRouterStateSerializer }),
  ],
  providers: [{ provide: RouterStateSerializer, useClass: CustomSerializer }],
})
export class AppStoreModule {}
