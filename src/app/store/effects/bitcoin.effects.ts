import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Actions, Effect} from '@ngrx/effects';
import {BitcoinActionTypes, ConfirmTransaction, CreateNewWallet, GetBitcoinValueSuccess} from '../actions/bitcoin.action';
import { GetBitcoinValue } from '../actions/bitcoin.action';
import {BitcoinService} from '../services/bitcoin.service';
import 'rxjs/add/operator/switchMap';

@Injectable()
export class BitcoinEffects {
  constructor(private actions: Actions,
              private bitcoinService: BitcoinService) {
  }

  @Effect()
  getBitcoinValue: Observable<any> = this.actions.
    ofType(BitcoinActionTypes.GET_BITCOIN_VALUE).
    map ((action: GetBitcoinValue) => action.payload).
    switchMap (payload => {
       return this.bitcoinService.getBitcoinValue().
         map((usdValue) => {
           return new GetBitcoinValueSuccess(usdValue);
       });
  });


  @Effect()
  createWalletAddress: Observable<any> = this.actions.
  ofType(BitcoinActionTypes.CREATE_NEW_WALLET).
  map ((action: CreateNewWallet) => action.payload).
  switchMap (payload => {
    return this.bitcoinService.getNewWalletAddress().
    map((usdValue) => {
      return new GetBitcoinValue(usdValue);
    });
  });

  @Effect()
  confirmTransaction: Observable<any> = this.actions.
  ofType(BitcoinActionTypes.CONFIRM_TRANSACTION).
  map ((action: ConfirmTransaction) => action.payload).
  switchMap (payload => {
    return this.bitcoinService.confirmTransaction(payload).
    map((usdValue) => {
      return new GetBitcoinValue(usdValue);
    });
  });
}


