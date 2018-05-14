import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { SharedService } from '../store/services';

// Actions
import { FinalLoading } from '../store/actions';

// Store
import { Store } from '@ngrx/store';
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
    this.store.dispatch(new FinalLoading({ loadingState: false }));
    this.sharedService.hideFooter.emit(true);
    this.sharedService.hideHeader.emit(true);
  }

  ngOnDestroy() {
    this.sharedService.hideFooter.emit(false);
    this.sharedService.hideHeader.emit(false);
  }
}
