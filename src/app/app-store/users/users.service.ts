// Angular
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

// Helpers
import { apiHeaders, apiUrl } from "../config";

// Models
import { Myself } from "../models";

// Rxjs
import { map } from "rxjs/operators";

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

@Injectable({ providedIn: "root" })
export class UsersService {
  constructor(private http: HttpClient) {}

  getMyself(): Promise<Myself> {
    const url = `${apiUrl}/users/myself/`;
    return this.http
      .get(url, apiHeaders())
      .pipe(map(data => data["results"]))
      .toPromise();
  }
}
