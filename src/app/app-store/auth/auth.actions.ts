// Models
import { Recover, Reset, SignIn, SignUp } from "../models";

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

export class PostRecover {
  static readonly type = "[Auth] PostRecover";
  constructor(public model: Recover) {}
}

export class PostRefresh {
  static readonly type = "[Auth] PostRefresh";
}

export class PostReset {
  static readonly type = "[Auth] PostReset";
  constructor(public commit: boolean, public model: Reset) {}
}

export class PostSignIn {
  static readonly type = "[Auth] PostSignIn";
  constructor(public model: SignIn) {}
}

export class PostSignOut {
  static readonly type = "[Auth] PostSignOut";
}

export class PostSignUp {
  static readonly type = "[Auth] PostSignUp";
  constructor(public commit: boolean, public model: SignUp) {}
}

export class PostVerify {
  static readonly type = "[Auth] PostVerify";
}
