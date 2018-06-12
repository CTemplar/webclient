///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

export class Recover {
  recovery_email: string;
  username: string;
}

export class Reset {
  code: string;
  password: string;
  password2?: string;
  private_key: string;
  public_key: string;
  username: string;
}

export class SignIn {
  password: string;
  username: string;
}

export class SignUp {
  password: string;
  password2?: string;
  private_key: string;
  public_key: string;
  recaptcha: string;
  recovery_email?: string;
  username: string;
}
