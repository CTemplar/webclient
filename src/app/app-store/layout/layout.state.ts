// Actions
import { ShowAlert, ShowCallToAction } from "../actions";

// Models
import { Alert } from "../models";

// Ngrx
import { Action, NgxsOnInit, State, StateContext } from "@ngxs/store";

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

export interface LayoutStateModel {
  alerts: Alert[];
  showCallToAction: boolean;
}

@State<LayoutStateModel>({
  name: "layout",
  defaults: {
    alerts: [],
    showCallToAction: true
  }
})
export class LayoutState implements NgxsOnInit {
  ngxsOnInit(ctx: StateContext<LayoutStateModel>) {
    ctx.dispatch(new ShowCallToAction(true));
  }

  @Action(ShowAlert)
  showAlert(ctx: StateContext<LayoutStateModel>, { payload }: ShowAlert) {
    const state = ctx.getState();
    ctx.patchState({ alerts: [...state.alerts, payload] });
  }

  @Action(ShowCallToAction)
  showCallToAction(
    ctx: StateContext<LayoutStateModel>,
    { status }: ShowCallToAction
  ) {
    ctx.patchState({ showCallToAction: status });
  }
}
