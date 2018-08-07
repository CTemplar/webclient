import { BitcoinState, TransactionStatus } from '../datatypes';
import { BitcoinActionAll, BitcoinActionTypes } from '../actions/bitcoin.action';

export const initialState: BitcoinState = {
  serviceValue: 0,
  newWalletAddress: null,
  loaded: false,
  redeemCode: null,
  checkTransactionResponse: { status: TransactionStatus.WAITING }
};

export function reducer(state = initialState, action: BitcoinActionAll): BitcoinState {
  switch (action.type) {
    case BitcoinActionTypes.GET_BITCOIN_SERVICE_VALUE: {
      return {
        ...state, loaded: false
      };
    }
    case BitcoinActionTypes.GET_BITCOIN_SERVICE_VALUE_SUCCESS: {
      return { ...state, serviceValue: action.payload.required_balance, loaded: true };
    }
    case BitcoinActionTypes.CREATE_NEW_WALLET : {
      return {
        ...state,
        loaded: false,
      };
    }
    case BitcoinActionTypes.CREATE_NEW_WALLET_SUCCESS : {
      return {
        ...state,
        loaded: true,
        newWalletAddress: action.payload.address,
        redeemCode: action.payload.redeem_code
      };
    }
    case BitcoinActionTypes.CHECK_TRANSACTION_SUCCESS: {
      return {
        ...state,
        checkTransactionResponse: action.payload
      };
    }
    case BitcoinActionTypes.CLEAR_WALLET: {
      return {
        ...initialState
      };
    }

    default : {
      return state;
    }
  }
}
