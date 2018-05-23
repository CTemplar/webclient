// Angular
import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/platform-browser';

// Services
import { BlogService } from './store/services';
import { SharedService } from './store/services';
// import { UsersService } from './users/shared/users.service';
import { Observable } from 'rxjs/Observable';
import { selectLoadingState } from './store/selectors';
import { Store } from '@ngrx/store';
import { LoadingState } from './store/datatypes';
import { quotes } from './store/quotes';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public hideFooter: boolean = false;
  public hideHeader: boolean = false;
  public windowIsResized: boolean = false;
  public resizeTimeout: number = null;
  public getLoadingState$: Observable<any>;
  public isLoading: boolean = true;
  public isMail: boolean = false;

  quote: object;

  constructor(
    @Inject(DOCUMENT) private document: any,
    public router: Router,
    private blogService: BlogService,
    private sharedService: SharedService,
    private store: Store<any>
  ) {
    this.sharedService.hideHeader.subscribe(data => (this.hideHeader = data));
    this.sharedService.hideFooter.subscribe(data => (this.hideFooter = data));
    this.sharedService.isMail.subscribe(data => (this.isMail = data));
    this.getLoadingState$ = this.store.select(selectLoadingState);
  }


  ngOnInit() {
    this.router.events.subscribe(params => window.scrollTo(0, 0));
    this.updateLoadingStatus();

    this.quote = quotes[Math.floor(Math.random() * 5)];

  }

  // Resize event for window object
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.windowIsResized = true;
    if (this.resizeTimeout && this.windowIsResized) {
      // this.windowIsResized = true;
      clearTimeout(this.resizeTimeout);
    }
    this.resizeTimeout = setTimeout(
      (() => {
        this.windowIsResized = false;
      }).bind(this),
      10
    );
  }

  private updateLoadingStatus(): void {
    this.getLoadingState$.subscribe((loadingState: LoadingState) => {
      this.isLoading = loadingState.Loading;
    });
  }
}
