import { Component, OnDestroy, OnInit } from '@angular/core';
import { SharedService } from '../core/providers';

@Component({
  selector: 'app-mail',
  templateUrl: './mail.component.html',
  styleUrls: ['./mail.component.scss']
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
