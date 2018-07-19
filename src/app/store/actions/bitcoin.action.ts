import {Action} from '@ngrx/store';

export enum BitcoinActionTypes {
  GET_BITCOIN_VALUE = '[GET_BITCOIN_VALUE] GET BITCOIN VALUE',
  GET_BITCOIN_VALUE_SUCCESS = '[GET_BITCOIN_VALUE_SUCCESS] GET BITCOIN VALUE SUCCESS',
  CREATE_NEW_WALLET = '[CREATE_NEW_WALLET ] CREATE NEW WALLET',
  CREATE_NEW_WALLET_SUCCESS = '[CREATE_NEW_WALLET_SUCCESS ] CREATE NEW WALLET',
  CONFIRM_TRANSACTION = '[CONFIRM_TRANSACTION] CONFIRM TRANSACTION',
  CONFIRM_TRANSACTION_SUCCESS = '[CONFIRM_TRANSACTION_SUCCESS] CONFIRM TRANSACTION SUCCESS'
}

export class GetBitcoinValue implements Action {
  readonly type = BitcoinActionTypes.GET_BITCOIN_VALUE;

  constructor(public payload?: any) {
  }
}
export class GetBitcoinValueSuccess implements Action {
  readonly type = BitcoinActionTypes.GET_BITCOIN_VALUE_SUCCESS;

  constructor(public payload: any) {
  }
}

export class CreateNewWallet implements Action {
  readonly type = BitcoinActionTypes.CREATE_NEW_WALLET;

  constructor(public payload?: any) {
  }
}

export class ConfirmTransaction implements Action {
  readonly type = BitcoinActionTypes.CONFIRM_TRANSACTION;

  constructor(public payload: any) {
  }
}
export class ConfirmTransactionSuccess implements Action {
  readonly type = BitcoinActionTypes.CONFIRM_TRANSACTION_SUCCESS;

  constructor(public payload: any) {
  }
}
export class CreateNewWalletSuccess implements Action {
  readonly type = BitcoinActionTypes.CREATE_NEW_WALLET_SUCCESS;

  constructor(public payload: any) {
  }
}

export type BitcoinActionAll =
  GetBitcoinValue |
  GetBitcoinValueSuccess |
  CreateNewWallet |
  CreateNewWalletSuccess |
  ConfirmTransaction |
  ConfirmTransactionSuccess;
