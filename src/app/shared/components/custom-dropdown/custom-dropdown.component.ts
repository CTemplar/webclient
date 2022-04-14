/* eslint-disable unicorn/prevent-abbreviations */
/* eslint-disable @typescript-eslint/ban-types */
import { Component, EventEmitter, forwardRef, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'custom-dropdown',
  templateUrl: './custom-dropdown.component.html',
  styleUrls: ['./custom-dropdown.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomDropdownComponent),
      multi: true,
    },
  ],
})
export class CustomDropdownComponent implements OnChanges {
  @Input() options: any[];

  @Input() value: any;

  @Output() change = new EventEmitter<any>();

  selectedOption: any = null;

  onChange: (_: any) => {};

  ngOnChanges(changes: SimpleChanges) {
    if (changes.value && this.value) {
      this.selectedOption = this.options?.find(x => x.value === this.value);
    }
  }

  writeValue(value: string) {
    this.selectedOption = value;
  }

  registerOnChange(fn: (_: any) => {}) {
    this.onChange = fn;
  }

  changeSelectedOption(option: any) {
    this.selectedOption = option;
    this.onChange?.(option?.value);
    this.change.emit(option.value);
  }

  registerOnTouched() {}
}
