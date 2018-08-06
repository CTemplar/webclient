import { Component, OnInit } from '@angular/core';
import { ngxZendeskWebwidgetService } from 'ngx-zendesk-webwidget';

@Component({
  selector: 'app-pages-support',
  templateUrl: './pages-support.component.html',
  styleUrls: ['./pages-support.component.scss']
})
export class PagesSupportComponent implements OnInit {


  constructor(private _ngxZendeskWebwidgetService: ngxZendeskWebwidgetService) { }

  ngOnInit() {
  }

  showZenDeskHelpWidget() {
    this._ngxZendeskWebwidgetService.activate();
  }

}
