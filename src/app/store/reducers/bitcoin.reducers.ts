import {BitcoinState} from '../datatypes';
import {BitcoinActionAll, BitcoinActionTypes} from '../actions/bitcoin.action';
import {MailActionTypes} from '../actions';

export const initialState: BitcoinState = {
  currentUSDValue: 0,
  newWalletAddress: null,
  loaded: false,
  Wif: null
};

export function reducer(state = initialState, action: BitcoinActionAll) {
  switch (action.type) {
    case BitcoinActionTypes.GET_BITCOIN_VALUE : {
      return {
        ...state, loaded: false
      };
    }
    case BitcoinActionTypes.GET_BITCOIN_VALUE_SUCCESS: {
      return { ...state, currentUSDValue: action.payload.USD, loaded: true   };
    }
    case BitcoinActionTypes.CREATE_NEW_WALLET : {
      return {
        ...state
      };
    }
    case BitcoinActionTypes.CREATE_NEW_WALLET_SUCCESS : {
      return {
        ...state, newWalletAddress: action.payload.address,
        wif: action.payload.wif
      };
    }
    case BitcoinActionTypes.CONFIRM_TRANSACTION: {
      return { ...state, loaded: false   };
    }
    case BitcoinActionTypes.CONFIRM_TRANSACTION_SUCCESS: {
      return { ...state, loaded: true   };
    }
    default : {
      return state;
    }
  }
}
