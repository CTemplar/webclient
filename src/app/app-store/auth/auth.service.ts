// Angular
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

// Helpers
import { apiHeaders, apiUrl } from '../config';

// Models
import { SignIn, SignUp } from "../models";

// Rxjs
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

@Injectable({ providedIn: "root" })
export class AuthService {

  constructor(private http: HttpClient) {}

  postSignIn(body): Observable<string> {
    const url = `${apiUrl}/auth/sign-in/`;
    return this.http.post<string>(url, body, apiHeaders());
  }
}
