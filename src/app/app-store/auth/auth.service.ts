// Angular
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

// Config.
import { apiUrl } from "../config";

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

@Injectable({ providedIn: "root" })
export class AuthService {
  constructor(private http: HttpClient) {}

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
