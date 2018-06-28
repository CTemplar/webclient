// Actions
import { DeleteMyself, GetMyself } from "../actions";

// Models
import { Myself } from "../models";

// Ngrx
import { Action, Selector, State, StateContext } from "@ngxs/store";

// Services
import { UsersService } from "../services";

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

export interface UsersStateModel {
  myself: Myself;
}

@State<UsersStateModel>({
  name: "users",
  defaults: {
    myself: null
  }
})
export class UsersState {
  constructor(private usersService: UsersService) {}

  @Action(GetMyself)
  getMyself(ctx: StateContext<UsersStateModel>) {
    return this.usersService
      .getMyself()
      .then(data => ctx.patchState({ myself: data }));
  }

  @Action(DeleteMyself)
  deleteMyself(ctx: StateContext<UsersStateModel>) {
    ctx.patchState({ myself: null });
  }
}
