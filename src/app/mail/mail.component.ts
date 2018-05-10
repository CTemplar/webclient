import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { SharedService } from '../store/services';

@Component({
  selector: 'app-mail',
  templateUrl: './mail.component.html',
  styleUrls: ['./mail.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class MailComponent implements OnDestroy, OnInit {

  constructor(
    private sharedService: SharedService,
  ) {
  }

  ngOnInit() {
    this.sharedService.hideFooter.emit(true);
    this.sharedService.hideHeader.emit(true);
  }

  ngOnDestroy() {
    this.sharedService.hideFooter.emit(false);
    this.sharedService.hideHeader.emit(false);
  }
}
