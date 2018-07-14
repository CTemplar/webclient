import {BitcoinState} from '../datatypes';
import {BitcoinActionAll, BitcoinActionTypes} from '../actions/bitcoin.action';
import {MailActionTypes} from '../actions';

export const initialState: BitcoinState = {
  currentUsdValue: 0,
  newWalletAddress: null
};

export function reducer(state = initialState, action: BitcoinActionAll) {
  switch (action.type) {
    case BitcoinActionTypes.GET_BITCOIN_VALUE : {
      return {
        ...state
      };
    }
    case BitcoinActionTypes.CREATE_NEW_WALLET : {
      return {
        ...state, newWalletAddress: action.payload
      };
    }
    case BitcoinActionTypes.GET_BITCOIN_VALUE_SUCCESS: {
      return { ...state, currentUsdValue: action.payload.USD   };
    }
    default : {
      return state;
    }
  }
}
