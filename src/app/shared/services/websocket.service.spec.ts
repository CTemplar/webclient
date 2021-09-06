import { TestBed } from '@angular/core/testing';
import { provideMockStore  } from '@ngrx/store/testing';

import { WebsocketService } from './websocket.service';

describe('WebsocketService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [provideMockStore({})],
  }));

  it('should be created', () => {
    const service: WebsocketService = TestBed.get(WebsocketService);
    expect(service).toBeTruthy();
  });
});
