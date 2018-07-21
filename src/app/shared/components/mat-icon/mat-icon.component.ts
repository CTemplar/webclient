import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-mat-icon',
  templateUrl: './mat-icon.component.html',
  styleUrls: ['./mat-icon.component.scss']
})
export class MatIconComponent implements OnInit {

  @Input() iconName: string;

  @Input() iconSize: string = '18';

  @Input() optionalClasses: string = '';

  @Input() color: string = 'darkgrey-2';

  @Input() vertilcalAlign: boolean = true;

  @Input() alignVerticalClass: string = 'align-middle';

  private materialIconSizes = [16, 18, 20, 24, 36, 30, 48];

  constructor() { }

  ngOnInit() {

    // if (this.iconFamily === IconFamilyEnum.MATERIAL && ! _.includes(this.materialIconSizes, parseInt(this.iconSize))) {
    //   this.iconSize = '18';
    // }

    if (! this.vertilcalAlign) {
      this.alignVerticalClass = '';
    }
  }

}


