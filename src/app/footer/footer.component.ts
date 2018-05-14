// Angular
import { Component } from '@angular/core';

// Service
import { SharedService } from '../store/services';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {

  // Switch the footer call to action for this view.
  hideFooterCallToAction: boolean = false;
  hideEntireFooterCallToAction: boolean = false;
  constructor(private sharedService: SharedService) {
    this.sharedService.hideFooter
      .subscribe(data => this.hideFooterCallToAction = data);
    this.sharedService.hideEntireFooter.subscribe(data => (this.hideEntireFooterCallToAction = data));
  }
}
