// Angular
import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// Helpers
import { apiUrl } from '../../shared/config';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class SharedService {
  isReady: EventEmitter<boolean> = new EventEmitter();
  hideFooter: EventEmitter<boolean> = new EventEmitter();
  hideHeader: EventEmitter<boolean> = new EventEmitter();
  hideEntireFooter: EventEmitter<boolean> = new EventEmitter();
  keyPressed: EventEmitter<any> = new EventEmitter();
  //
  constructor(
    private http: HttpClient,
  ) {}

}
