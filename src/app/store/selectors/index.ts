// Angular
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
// Ngrx
import * as fromRouter from '@ngrx/router-store';
// Model
import { RouterStateUrl } from '../datatypes';
import { Injectable } from '@angular/core';


@Injectable()
export class CustomSerializer
  implements fromRouter.RouterStateSerializer<RouterStateUrl> {
  serialize(routerState: RouterStateSnapshot): RouterStateUrl {
    const { url } = routerState;
    const { queryParams } = routerState.root;

    let state: ActivatedRouteSnapshot = routerState.root;
    while (state.firstChild) {
      state = state.firstChild;
    }
    const { params } = state;

    return { url, queryParams, params, state };
  }
}
