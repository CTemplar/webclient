// Angular
import { HttpHeaders } from "@angular/common/http";

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

export function apiHeaders() {
  return {
    headers: new HttpHeaders({
      Authorization: `JWT ${localStorage.getItem("token")}`
    })
  };
}

export const apiUrl = "http://localhost:8000";
