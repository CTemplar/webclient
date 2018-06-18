// Angular
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

// Others
import { apiHeaders, apiUrl } from "../config";

// Rxjs
import { map } from "rxjs/operators";

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

@Injectable({ providedIn: "root" })
export class EmailsService {
  constructor(private http: HttpClient) {}

  getMailbox(): Promise<any> {
    const url = `${apiUrl}/emails/mailboxes/`;
    return this.http
      .get(url, apiHeaders())
      .pipe(map(data => data["results"]))
      .toPromise();
  }
}
