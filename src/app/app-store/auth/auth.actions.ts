///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

export class PostRecover {
  static readonly type = "[Auth] PostRecover";
  constructor(public payload: { recovery_email: string; username: string }) {}
}

export class PostRefresh {
  static readonly type = "[Auth] PostRefresh";
}

export class PostReset {
  static readonly type = "[Auth] PostReset";
  constructor(
    public payload: {
      code: string;
      fingerprint: string;
      password: string;
      private_key: string;
      public_key: string;
      username: string;
    }
  ) {}
}

export class PostSignIn {
  static readonly type = "[Auth] PostSignIn";
  constructor(public payload: { password: string; username: string }) {}
}

export class PostSignOut {
  static readonly type = "[Auth] PostSignOut";
}


export class PostSignUp {
  static readonly type = "[Auth] PostSignUp";
  constructor(
    public payload: {
      fingerprint: string;
      password: string;
      private_key: string;
      public_key: string;
      recaptcha: string;
      recovery_email?: string;
      username: string;
    }
  ) {}
}

export class PostVerify {
  static readonly type = "[Auth] PostVerify";
}
