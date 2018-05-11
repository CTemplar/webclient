// Angular
import { Component, OnInit } from '@angular/core';
import { NumberOfColumns, Mode } from '../store/models';

import { selectLoadingState, getRouterState } from '../store/selectors';

// Store
import { Store } from '@ngrx/store';
// Rxjs
import { Observable } from 'rxjs/Observable';
import { LoadingState, RouterStateUrl } from '../store/datatypes';

// Actions
import { FinalLoading } from '../store/actions';

// Services
import { ngxZendeskWebwidgetService } from 'ngx-zendesk-webwidget';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  numberOfColumns: NumberOfColumns;
  mode: Mode;
  getRelatedBlogsState$: Observable<any>;
  getRouterState$: Observable<any>;
  currentUrl: String;
  constructor(
    private store: Store<any>,
    private _ngxZendeskWebwidgetService: ngxZendeskWebwidgetService
  ) {
    this.getRelatedBlogsState$ = this.store.select(selectLoadingState);
    this.getRouterState$ = this.store.select(getRouterState);
    _ngxZendeskWebwidgetService.identify({
      name: '',
      email: ''
    });
    _ngxZendeskWebwidgetService.show();
  }

  ngOnInit() {
    this.numberOfColumns = NumberOfColumns.Three;
    this.mode = Mode.Recent;
    this.getRelatedBlogsState$.subscribe((loadingState: LoadingState) => {
      if (loadingState.RecentBlogLoading === false) {
        if (this.currentUrl === '/' && loadingState.Loading === true) {
          this.store.dispatch(new FinalLoading({ loadingState: false }));
        }
      }
    });
    this.getRouterState$.subscribe((routerStateUrl: RouterStateUrl) => {
      this.currentUrl = routerStateUrl.state.url;
    });
  }
}
