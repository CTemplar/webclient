import {Action} from '@ngrx/store';

export enum BitcoinActionTypes {
  GET_BITCOIN_VALUE = '[GET_BITCOIN_VALUE] GET_BITCOIN_VALUE',
  GET_BITCOIN_VALUE_SUCCESS = '[GET_BITCOIN_VALUE_SUCCESS] GET_BITCOIN_VALUE_SUCCESS',
  CREATE_NEW_WALLET = '[CREATE_NEW_WALLET ] CREATE_NEW_WALLET',
  CONFIRM_TRANSACTION = '[CONFIRM_TRANSACTION] CONFIRM_TRANSACTION'
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

  constructor(public payload: any) {
  }
}

export class ConfirmTransaction implements Action {
  readonly type = BitcoinActionTypes.CONFIRM_TRANSACTION;

  constructor(public payload: any) {
  }
}

export type BitcoinActionAll =
  GetBitcoinValue |
  GetBitcoinValueSuccess |
  CreateNewWallet |
  ConfirmTransaction;
