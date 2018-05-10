// Angular
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

// Model
import { Storage} from '../../../../store/models';

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
@Component({
  selector: 'app-storage-dropdown',
  templateUrl: './storage-dropdown.component.html',
  styleUrls: ['./storage-dropdown.component.scss']
})
export class StorageDropdownComponent implements OnInit {
  @Input('storageList') storageList: Storage[];
  @Input('selectedStorage') selectedStorage: Storage;
  @Output('storageSelected') storageSelected = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  onItemSelect(item: any) {
  this.storageSelected.next(item);
  }
}
