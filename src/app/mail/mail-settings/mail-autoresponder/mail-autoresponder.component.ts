import { Component, OnInit } from '@angular/core';
import { OnDestroy, TakeUntilDestroy } from 'ngx-take-until-destroy';
import { Observable } from 'rxjs/Observable';

@TakeUntilDestroy()
@Component({
  selector: 'app-mail-autoresponder',
  templateUrl: './mail-autoresponder.component.html',
  styleUrls: ['./mail-autoresponder.component.scss', '../mail-settings.component.scss']
})
export class MailAutoresponderComponent implements OnInit, OnDestroy {
  readonly destroyed$: Observable<boolean>;

  constructor() {
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
  }

}
