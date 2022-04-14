import { OrganizationActionAll, OrganizationActionTypes } from '../actions/organization.action';
import { Organization } from '../datatypes';
import { OrganizationUser } from '../models';
import { sortByString } from '../services';

export interface OrganizationState {
  organizations: Organization[];
  selectedOrganization: Organization;
  users: OrganizationUser[];
  inProgress?: boolean;
  isAddingUserInProgress?: boolean;
  isDeleteInProgress?: boolean;
  isError?: boolean;
  error?: string;
}

const initialState: OrganizationState = {
  users: [],
  organizations: [],
  selectedOrganization: null,
};

// eslint-disable-next-line unicorn/no-object-as-default-parameter
export function reducer(state: OrganizationState = initialState, action: OrganizationActionAll) {
  switch (action.type) {
    case OrganizationActionTypes.GET_ORGANIZATIONS: {
      return { ...state, inProgress: true };
    }

    case OrganizationActionTypes.GET_ORGANIZATIONS_SUCCESS: {
      return { ...state, inProgress: false, organizations: action.payload };
    }

    case OrganizationActionTypes.GET_ORGANIZATIONS_FAILURE: {
      return { ...state, inProgress: false };
    }

    case OrganizationActionTypes.ADD_ORGANIZATION: {
      return { ...state, inProgress: true, selectedOrganization: null };
    }

    case OrganizationActionTypes.ADD_ORGANIZATION_SUCCESS: {
      return { ...state, inProgress: false, selectedOrganization: action.payload };
    }

    case OrganizationActionTypes.ADD_ORGANIZATION_FAILURE: {
      return { ...state, inProgress: false, selectedOrganization: null };
    }

    case OrganizationActionTypes.UPDATE_ORGANIZATION: {
      return { ...state, inProgress: true };
    }

    case OrganizationActionTypes.UPDATE_ORGANIZATION_SUCCESS: {
      return { ...state, inProgress: false, selectedOrganization: action.payload };
    }

    case OrganizationActionTypes.UPDATE_ORGANIZATION_FAILURE: {
      return { ...state, inProgress: false };
    }

    case OrganizationActionTypes.DELETE_ORGANIZATION: {
      return { ...state, inProgress: true };
    }

    case OrganizationActionTypes.DELETE_ORGANIZATION_SUCCESS: {
      return { ...state, inProgress: false, selectedOrganization: null };
    }

    case OrganizationActionTypes.DELETE_ORGANIZATION_FAILURE: {
      return { ...state, inProgress: false };
    }

    case OrganizationActionTypes.GET_ORGANIZATION_USERS: {
      return { ...state, inProgress: true };
    }

    case OrganizationActionTypes.GET_ORGANIZATION_USERS_SUCCESS: {
      return {
        ...state,
        inProgress: false,
        users: sortByString(action.payload, 'username'),
      };
    }

    case OrganizationActionTypes.GET_ORGANIZATION_USERS_FAILURE: {
      return { ...state, inProgress: false };
    }

    case OrganizationActionTypes.ADD_ORGANIZATION_USER: {
      return { ...state, isAddingUserInProgress: true, isError: false };
    }

    case OrganizationActionTypes.ADD_ORGANIZATION_USER_SUCCESS: {
      return {
        ...state,
        isAddingUserInProgress: false,
        users: sortByString([...state.users, new OrganizationUser(action.payload)], 'username'),
        isError: false,
      };
    }

    case OrganizationActionTypes.ADD_ORGANIZATION_USER_FAILURE: {
      return { ...state, isAddingUserInProgress: false, error: action.payload, isError: true };
    }

    case OrganizationActionTypes.DELETE_ORGANIZATION_USER: {
      return { ...state, isDeleteInProgress: true };
    }

    case OrganizationActionTypes.DELETE_ORGANIZATION_USER_SUCCESS: {
      return {
        ...state,
        isDeleteInProgress: false,
        users: state.users.filter(user => user.username !== action.payload.username),
      };
    }

    case OrganizationActionTypes.UPDATE_ORGANIZATION_USER: {
      return { ...state, isAddingUserInProgress: true, isError: false };
    }

    case OrganizationActionTypes.UPDATE_ORGANIZATION_USER_SUCCESS: {
      return {
        ...state,
        isAddingUserInProgress: false,
        users: state.users.map(user => {
          if (user.user_id === action.payload.user_id) {
            user = action.payload;
          }
          return user;
        }),
        isError: false,
      };
    }

    case OrganizationActionTypes.UPDATE_ORGANIZATION_USER_FAILURE: {
      return {
        ...state,
        isAddingUserInProgress: false,
        users: state.users.map(user => {
          if (user.user_id === action.payload.user.user_id) {
            user = action.payload.user.unmodifiedUser;
          }
          return user;
        }),
        error: action.payload.error,
        isError: true,
      };
    }

    default: {
      return state;
    }
  }
}
