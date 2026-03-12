import { TestBed } from '@angular/core/testing';

import { LoginActionsService } from './login-actions-service';

describe('LoginActionsService', () => {
  let service: LoginActionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoginActionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
