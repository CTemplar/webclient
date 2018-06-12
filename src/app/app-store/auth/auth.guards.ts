// Angular
import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";

// Ngxs
import { Store } from "@ngxs/store";

// States
import { AuthState } from "../states";

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

@Injectable({ providedIn: "root" })
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private store: Store) {}
  canActivate() {
    const token = this.store.selectSnapshot(AuthState.token);
    if (token) return true;
    else this.router.navigate(["/sign-in"]);
  }
}

@Injectable({ providedIn: "root" })
export class NotAuthGuard implements CanActivate {
  constructor(private router: Router, private store: Store) {}
  canActivate() {
    const token = this.store.selectSnapshot(AuthState.token);
    if (token) this.router.navigate(["/mailbox"]);
    else return true;
  }
}
