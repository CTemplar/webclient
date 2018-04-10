import { Component, OnDestroy, OnInit } from '@angular/core';
import { SharedService } from '../shared/shared.service';

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
    this.sharedService.isMail.emit(true);
  }

  ngOnDestroy() {
    this.sharedService.isMail.emit(false);
  }
}
