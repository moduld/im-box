import { TestBed, inject } from '@angular/core/testing';

import { StateKeeperService } from './state-keeper.service';

describe('StateKeeperService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StateKeeperService]
    });
  });

  it('should be created', inject([StateKeeperService], (service: StateKeeperService) => {
    expect(service).toBeTruthy();
  }));
});
