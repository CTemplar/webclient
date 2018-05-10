// Angular
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-free-plan',
  templateUrl: './free-plan.component.html',
  styleUrls: ['./free-plan.component.scss']
})
export class FreePlanComponent implements OnInit {
  @Input('selectedIndex') selectedIndex: any;
  constructor() { }

  ngOnInit() {
  }

}
