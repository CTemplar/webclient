import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';

import { SpinnerService } from '../services/spinner.service';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss'],
})
export class SpinnerComponent implements OnInit, OnDestroy {
  private isShowing = false;

  @Input() name: string;

  @Input() group: string;

  @Input() loadingImage: string;

  @Output() showChange = new EventEmitter();

  @Input()
  get show(): boolean {
    return this.isShowing;
  }

  set show(value: boolean) {
    this.isShowing = value;
    this.showChange.emit(this.isShowing);
  }

  constructor(private spinnerService: SpinnerService) {}

  ngOnInit() {
    if (!this.name) {
      throw new Error('Name attribute must be supplied for this spinner');
    }

    this.spinnerService.register(this);
  }

  ngOnDestroy(): void {
    this.spinnerService.unregister(this);
  }
}
