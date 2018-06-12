// Models
import { Alert } from "../models";

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

export class ShowAlert {
  static readonly type = "[Layout] ShowAlert";
  constructor(public payload: Alert) {}
}

export class ShowCallToAction {
  static readonly type = "[Layout] ShowCallToAction";
  constructor(public status: boolean) {}
}
