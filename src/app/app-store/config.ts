// Angular
import { HttpHeaders } from "@angular/common/http";
import { environment } from "../../environments/environment";

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

export function apiHeaders() {
  return {
    headers: new HttpHeaders({
      Authorization: `JWT ${localStorage.getItem("token")}`
    })
  };
}

export const apiUrl = environment.production ? "https://api.ctemplar.com" : "http://localhost:8000";
