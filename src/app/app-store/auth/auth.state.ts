// Actions
import { PostSignIn, PostSignOut, PostSignUp } from "../actions";

// Angular
import { Router } from "@angular/router";

// Models
// import { SignUp } from "../models";

// Ngrx
import { Action, NgxsOnInit, Selector, State, StateContext } from "@ngxs/store";

// Rxjs
import { tap } from "rxjs/operators";

// Services
import { AuthService } from "../services";

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

export interface AuthStateModel {
  // signUp: SignUp;
  token: string;
}

@State<AuthStateModel>({
  name: "auth",
  defaults: {
    // signUp: null,
    token: null
  }
})
export class AuthState implements NgxsOnInit {
  @Selector()
  static token(state: AuthStateModel) {
    return state.token;
  }

  constructor(private authService: AuthService, private router: Router) {}

  ngxsOnInit(ctx: StateContext<AuthStateModel>) {
    // TODO: Check if it is valid token, or PostSignOut on first time. Later activate periodical refresh on navigation. So if cannot verify, we don't refresh on first load neither.
    // if (ctx.getState().token != null) ctx.dispatch(new PostVerify());;
    // else console.log('was filled');
  }

  @Action(PostSignIn)
  postSignIn(ctx: StateContext<AuthStateModel>, { payload }: PostSignIn) {
    return this.authService.postSignIn(payload).pipe(
      tap(data => {
        ctx.patchState({ token: data });
      })
    );
  }

  @Action(PostSignOut)
  postSignOut(ctx: StateContext<AuthStateModel>) {
    ctx.patchState({ token: undefined });
    this.router.navigate(["/sign-in"]);
  }
}
