// Angular
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

// Helpers
declare var argon2;
declare var openpgp;
import { apiUrl } from "../config";

// Models
import { SignIn, SignUp } from "../models";

// Rxjs
// import { Observable } from "rxjs";

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

@Injectable({ providedIn: "root" })
export class AuthService {
  constructor(private http: HttpClient) {}

  async genPgpKey(model) {
    const options = {
      numBits: 4096,
      passphrase: model.password,
      userIds: { name: `${model.username}@ctemplar.com` }
    };
    const key = await openpgp.generateKey(options);
    model.public_key = key.publicKeyArmored;
    model.private_key = key.privateKeyArmored;
    return model;
  }

  async genPwdHash(model) {
    const pwd = await argon2.hash({
      distPath: "/assets/argon2",
      hashLen: 33,
      mem: 1337,
      parallelism: 3,
      pass: model.password,
      salt: "33dividedby0",
      time: 33,
      type: argon2.ArgonType.Argon2i
    });
    model.password = pwd.hashHex;
    return model;
  }

  postRecover(body): Promise<any> {
    const url = `${apiUrl}/auth/recover/`;
    return this.http.post(url, body).toPromise();
  }

  postRefresh(body): Promise<any> {
    const url = `${apiUrl}/auth/refresh/`;
    return this.http.post(url, body).toPromise();
  }

  postReset(body): Promise<any> {
    const url = `${apiUrl}/auth/reset/`;
    return this.http.post(url, body).toPromise();
  }

  postSignIn(body): Promise<any> {
    const url = `${apiUrl}/auth/sign-in/`;
    return this.http.post(url, body).toPromise();
  }

  postSignUp(body): Promise<any> {
    const url = `${apiUrl}/auth/sign-up/`;
    return this.http.post(url, body).toPromise();
  }

  postVerify(body): Promise<any> {
    const url = `${apiUrl}/auth/verify/`;
    return this.http.post(url, body).toPromise();
  }
}
