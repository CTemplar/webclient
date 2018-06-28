// Actions
import {
  DeleteMyself,
  GetMailbox,
  GetMyself,
  PostRecover,
  PostRefresh,
  PostReset,
  PostSignIn,
  PostSignOut,
  PostSignUp,
  PostVerify
} from "../actions";

// Helpers
import { genPgpKey, genPwdHash } from "../helpers";

// Models
import { SignUp } from "../models";

// Ngrx
import { Action, NgxsOnInit, Selector, State, StateContext } from "@ngxs/store";

// Services
import { AuthService } from "../services";

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

export interface AuthStateModel {
  signUp: SignUp;
  token: string;
}

@State<AuthStateModel>({
  name: "auth",
  defaults: {
    signUp: null,
    token: null
  }
})
export class AuthState implements NgxsOnInit {
  @Selector()
  static token(state: AuthStateModel) {
    return state.token;
  }

  constructor(private authService: AuthService) {}

  ngxsOnInit(ctx: StateContext<AuthStateModel>) {
    ctx.dispatch(new PostVerify());
  }

  @Action(PostRecover)
  async postRecover(
    ctx: StateContext<AuthStateModel>,
    { model }: PostRecover
  ) {
    return this.authService.postRecover(model);
  }

  @Action(PostRefresh)
  async postRefresh(ctx: StateContext<AuthStateModel>) {
    const token = ctx.getState().token;
    if (token != null) {
      return this.authService
        .postRefresh(token)
        .then(
          data => ctx.patchState({ token: data }),
          error => ctx.dispatch(new PostSignOut())
        );
    }
  }

  @Action(PostReset)
  async postReset(
    ctx: StateContext<AuthStateModel>,
    { commit, model }: PostReset
  ) {
    if (commit) {
      await genPgpKey(model);
      await genPwdHash(model);
      return this.authService.postReset(model).then(data => {
        ctx.patchState({ token: data });
        ctx.dispatch(new GetMyself());
      });
    }
  }

  @Action(PostSignIn)
  async postSignIn(ctx: StateContext<AuthStateModel>, { model }: PostSignIn) {
    const password = model.password;
    await genPwdHash(model);
    return this.authService.postSignIn(model).then(data => {
      ctx.patchState({ token: data });
      ctx.dispatch([new GetMailbox(password), new GetMyself()]);
    });
  }

  @Action(PostSignOut)
  postSignOut(ctx: StateContext<AuthStateModel>) {
    ctx.patchState({ token: undefined });
    ctx.dispatch(new DeleteMyself());
  }

  @Action(PostSignUp)
  async postSignUp(
    ctx: StateContext<AuthStateModel>,
    { commit, model }: PostSignUp
  ) {
    if (commit)
      return this.authService.postSignUp(model).then(data => {
        ctx.patchState({ token: data });
        ctx.dispatch(new GetMyself());
      });
    else {
      await genPgpKey(model);
      await genPwdHash(model);
      ctx.patchState({ signUp: model });
    }
  }

  @Action(PostVerify)
  async postVerify(ctx: StateContext<AuthStateModel>) {
    const token = ctx.getState().token;
    if (token != null) {
      return this.authService
        .postVerify(token)
        .then(
          data => ctx.dispatch(new GetMyself()),
          error => ctx.dispatch(new PostSignOut())
        );
    }
  }
}
