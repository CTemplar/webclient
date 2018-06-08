// Actions
import { ShowCallToAction } from "../actions";

// Ngrx
import { Action, NgxsOnInit, State, StateContext } from "@ngxs/store";

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

export interface LayoutStateModel {
  showCallToAction: boolean;
}

@State<LayoutStateModel>({
  name: "layout",
  defaults: {
    showCallToAction: true
  }
})
export class LayoutState implements NgxsOnInit {
  ngxsOnInit(ctx: StateContext<LayoutStateModel>) {
    ctx.dispatch(new ShowCallToAction(true));
  }

  @Action(ShowCallToAction)
  showCallToAction(
    ctx: StateContext<LayoutStateModel>,
    { status }: ShowCallToAction
  ) {
    ctx.patchState({ showCallToAction: status });
  }
}
