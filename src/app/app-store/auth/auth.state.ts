// Actions
import {
  PostRecover,
  PostRefresh,
  PostReset,
  PostSignIn,
  PostSignOut,
  PostSignUp,
  PostVerify
} from "../actions";

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
    // TODO: Check if it is valid token, or PostSignOut on first time. Later activate periodical refresh on navigation. So if cannot verify, we don't refresh on first load neither.
    // if (ctx.getState().token != null) ctx.dispatch(new PostVerify());;
    // else console.log('was filled');
  }

  @Action(PostRecover)
  async postRecover(
    ctx: StateContext<AuthStateModel>,
    { payload }: PostRecover
  ) {
    return this.authService.postRecover(payload);
  }

  @Action(PostRefresh)
  async postRefresh(ctx: StateContext<AuthStateModel>) {
    const payload = ctx.getState().token;
    return this.authService.postRefresh(payload).then(data => {
      ctx.patchState({ token: data });
    });
  }

  @Action(PostReset)
  async postReset(
    ctx: StateContext<AuthStateModel>,
    { commit, payload }: PostReset
  ) {
    if (commit) {
      let model = await this.authService.genPgpKey(payload);
      model = await this.authService.genPwdHash(model);
      return this.authService.postReset(model).then(data => {
        ctx.patchState({ token: data });
      });
    } else {
    }
  }

  @Action(PostSignIn)
  async postSignIn(ctx: StateContext<AuthStateModel>, { payload }: PostSignIn) {
    payload = await this.authService.genPwdHash(payload);
    return this.authService.postSignIn(payload).then(data => {
      ctx.patchState({ token: data });
    });
  }

  @Action(PostSignOut)
  postSignOut(ctx: StateContext<AuthStateModel>) {
    ctx.patchState({ token: undefined });
  }

  @Action(PostSignUp)
  async postSignUp(
    ctx: StateContext<AuthStateModel>,
    { commit, payload }: PostSignUp
  ) {
    if (commit)
      return this.authService.postSignUp(payload).then(data => {
        ctx.patchState({ token: data });
      });
    else {
      let model = await this.authService.genPgpKey(payload);
      model = await this.authService.genPwdHash(model);
      ctx.patchState({ signUp: model });
    }
  }

  @Action(PostVerify)
  async postVerify(ctx: StateContext<AuthStateModel>) {
    const payload = ctx.getState().token;
    return this.authService.postVerify(payload).then(data => {
      ctx.patchState({ token: data });
    });
  }
}
