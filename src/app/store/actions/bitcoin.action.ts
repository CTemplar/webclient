import { Action } from '@ngrx/store';

export enum BitcoinActionTypes {
  CREATE_NEW_WALLET = '[BITCOIN ] CREATE NEW WALLET',
  CREATE_NEW_WALLET_SUCCESS = '[BITCOIN] CREATE NEW WALLET',
  CHECK_TRANSACTION = '[BITCOIN] CHECK TRANSACTION',
  CHECK_TRANSACTION_SUCCESS = '[BITCOIN] CHECK TRANSACTION SUCCESS',
  CLEAR_WALLET = '[BITCOIN] CLEAR WALLET',
}

export class CreateNewWallet implements Action {
  readonly type = BitcoinActionTypes.CREATE_NEW_WALLET;

  constructor(public payload?: any) {}
}

export class CheckTransaction implements Action {
  readonly type = BitcoinActionTypes.CHECK_TRANSACTION;

  constructor(public payload: any) {}
}

export class CheckTransactionSuccess implements Action {
  readonly type = BitcoinActionTypes.CHECK_TRANSACTION_SUCCESS;

  constructor(public payload: any) {}
}

export class CreateNewWalletSuccess implements Action {
  readonly type = BitcoinActionTypes.CREATE_NEW_WALLET_SUCCESS;

  constructor(public payload: any) {}
}

export class ClearWallet implements Action {
  readonly type = BitcoinActionTypes.CLEAR_WALLET;

  constructor(public payload?: any) {}
}

export type BitcoinActionAll =
  | CreateNewWallet
  | CreateNewWalletSuccess
  | CheckTransaction
  | CheckTransactionSuccess
  | ClearWallet;
