import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Actions, Effect } from '@ngrx/effects';
import {
  BitcoinActionTypes,
  CreateNewWallet,
  CreateNewWalletSuccess,
  GetBitcoinServiceValueSuccess,
  GetBitcoinServiceValue, CheckTransaction, CheckTransactionSuccess
} from '../actions/bitcoin.action';
import { BitcoinService } from '../services/bitcoin.service';
import 'rxjs/add/operator/switchMap';

@Injectable()
export class BitcoinEffects {
  constructor(private actions: Actions,
              private bitcoinService: BitcoinService) {
  }

  @Effect()
  getBitcoinServiceValue: Observable<any> = this.actions
    .ofType(BitcoinActionTypes.GET_BITCOIN_SERVICE_VALUE)
    .map((action: GetBitcoinServiceValue) => action.payload).switchMap(payload => {
      return this.bitcoinService.getBitcoinServiceValue().map((amount) => {
        return new GetBitcoinServiceValueSuccess(amount);
      });
    });


  @Effect()
  createWalletAddress: Observable<any> = this.actions
    .ofType(BitcoinActionTypes.CREATE_NEW_WALLET)
    .map((action: CreateNewWallet) => action.payload).switchMap(payload => {
      return this.bitcoinService.getNewWalletAddress().map((address) => {
        return new CreateNewWalletSuccess(address);
      });
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


