import { Action } from '@ngrx/store';

export enum BitcoinActionTypes {
  GET_BITCOIN_SERVICE_VALUE = '[BITCOIN] GET BITCOIN SERVICE VALUE',
  GET_BITCOIN_SERVICE_VALUE_SUCCESS = '[BITCOIN] GET BITCOIN SERVICE VALUE SUCCESS',
  CREATE_NEW_WALLET = '[BITCOIN ] CREATE NEW WALLET',
  CREATE_NEW_WALLET_SUCCESS = '[BITCOIN] CREATE NEW WALLET',
  CHECK_PENDING_BALANCE = '[BITCOIN] CHECK PENDING BALANCE',
  CHECK_PENDING_BALANCE_SUCCESS = '[BITCOIN] CHECK PENDING BALANCE SUCCESS',
  CLEAR_WALLET = '[BITCOIN] CLEAR WALLET',
}

export class GetBitcoinServiceValue implements Action {
  readonly type = BitcoinActionTypes.GET_BITCOIN_SERVICE_VALUE;

  constructor(public payload?: any) {
  }
}

export class GetBitcoinServiceValueSuccess implements Action {
  readonly type = BitcoinActionTypes.GET_BITCOIN_SERVICE_VALUE_SUCCESS;

  constructor(public payload: any) {
  }
}

export class CreateNewWallet implements Action {
  readonly type = BitcoinActionTypes.CREATE_NEW_WALLET;

  constructor(public payload?: any) {
  }
}

export class CheckPendingBalance implements Action {
  readonly type = BitcoinActionTypes.CHECK_PENDING_BALANCE;

  constructor(public payload: any) {
  }
}

export class CheckPendingBalanceSuccess implements Action {
  readonly type = BitcoinActionTypes.CHECK_PENDING_BALANCE_SUCCESS;

  constructor(public payload: any) {
  }
}

export class CreateNewWalletSuccess implements Action {
  readonly type = BitcoinActionTypes.CREATE_NEW_WALLET_SUCCESS;

  constructor(public payload: any) {
  }
}

export class ClearWallet implements Action {
  readonly type = BitcoinActionTypes.CLEAR_WALLET;

  constructor(public payload?: any) {
  }
}

export type BitcoinActionAll =
  | GetBitcoinServiceValue
  | GetBitcoinServiceValueSuccess
  | CreateNewWallet
  | CreateNewWalletSuccess
  | CheckPendingBalance
  | CheckPendingBalanceSuccess
  | ClearWallet;
