import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { SharedService } from '../store/services';

// Actions
import { FinalLoading } from '../store/actions';

// Store
import { Store } from '@ngrx/store';

// Service
@Component({
  selector: 'app-mail',
  templateUrl: './mail.component.html',
  styleUrls: ['./mail.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MailComponent implements OnDestroy, OnInit {

  constructor(
    private store: Store<any>,
    private sharedService: SharedService,
  ) {
  }

  ngOnInit() {
    setTimeout(() => this.store.dispatch(new FinalLoading({ loadingState: false })));
    this.sharedService.hideFooter.emit(true);
    this.sharedService.hideHeader.emit(true);
    this.sharedService.hideEntireFooter.emit(true);
  }

  ngOnDestroy() {
    this.sharedService.hideFooter.emit(false);
    this.sharedService.hideHeader.emit(false);
    this.sharedService.hideEntireFooter.emit(false);
  }
}
