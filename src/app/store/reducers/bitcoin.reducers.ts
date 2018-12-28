import { BitcoinState, TransactionStatus } from '../datatypes';
import { BitcoinActionAll, BitcoinActionTypes } from '../actions/bitcoin.action';

export const initialState: BitcoinState = {
  serviceValue: 0,
  bitcoinUSD: 3663.5,
  newWalletAddress: null,
  loaded: false,
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
      return { ...state, bitcoinUSD: action.payload.USD, loaded: true };
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
