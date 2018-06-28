// Angular
import { HttpHeaders } from "@angular/common/http";
import { environment } from "../../environments/environment";

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

export function apiHeaders() {
  const token = JSON.parse(localStorage.getItem('@@STATE')).auth.token.token;
  return {
    headers: new HttpHeaders({
      Authorization: `JWT ${token}`
    })
  };
}

export const apiUrl = environment.production ? "https://api.ctemplar.com" : "http://localhost:8000";
