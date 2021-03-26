import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs/internal/observable/of';

import {
  BitcoinActionTypes,
  CheckTransaction,
  CheckTransactionSuccess,
  CreateNewWallet,
  CreateNewWalletSuccess,
} from '../actions/bitcoin.action';
import { SnackErrorPush } from '../actions';
import { BitcoinService } from '../services/bitcoin.service';

@Injectable({
  providedIn: 'root',
})
export class BitcoinEffects {
  constructor(private actions: Actions, private bitcoinService: BitcoinService) {}

  @Effect()
  createWalletAddress: Observable<any> = this.actions.pipe(
    ofType(BitcoinActionTypes.CREATE_NEW_WALLET),
    map((action: CreateNewWallet) => action.payload),
    switchMap(payload => {
      return this.bitcoinService.createNewWallet(payload).pipe(
        switchMap(res => of(new CreateNewWalletSuccess(res))),
        catchError(error => of(new SnackErrorPush({ message: 'Failed to create a new Bitcoin wallet.' }))),
      );
    }),
  );

  @Effect()
  checkPendingTransaction: Observable<any> = this.actions.pipe(
    ofType(BitcoinActionTypes.CHECK_TRANSACTION),
    map((action: CheckTransaction) => action.payload),
    switchMap(payload => {
      return this.bitcoinService.checkTransaction(payload).pipe(
        map(response => new CheckTransactionSuccess(response)),
        catchError(error => of(new SnackErrorPush({ message: 'Failed to check the Bitcoin transaction.' }))),
      );
    }),
  );
}
