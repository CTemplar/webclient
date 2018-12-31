import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Actions, Effect } from '@ngrx/effects';
import { catchError, switchMap } from 'rxjs/operators';
import {
  BitcoinActionTypes,
  CheckTransaction,
  CheckTransactionSuccess,
  CreateNewWallet,
  CreateNewWalletSuccess,
} from '../actions/bitcoin.action';
import { BitcoinService } from '../services/bitcoin.service';
import 'rxjs/add/operator/switchMap';

@Injectable()
export class BitcoinEffects {
  constructor(private actions: Actions,
              private bitcoinService: BitcoinService) {
  }

  @Effect()
  createWalletAddress: Observable<any> = this.actions
    .ofType(BitcoinActionTypes.CREATE_NEW_WALLET)
    .map((action: CreateNewWallet) => action.payload)
    .switchMap(payload => {
      return this.bitcoinService.createNewWallet(payload)
        .pipe(
          switchMap(res => {
            return [
              new CreateNewWalletSuccess(res)
            ];
          }),
          catchError((error) => [])
        );
    });


  @Effect()
  checkPendingBalance: Observable<any> = this.actions
    .ofType(BitcoinActionTypes.CHECK__TRANSACTION)
    .map((action: CheckTransaction) => action.payload).switchMap(payload => {
      return this.bitcoinService.checkTransaction(payload).map((response) => {
        return new CheckTransactionSuccess(response);
      });
    });
}


