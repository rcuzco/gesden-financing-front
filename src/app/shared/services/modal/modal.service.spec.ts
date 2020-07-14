import { TestBed } from '@angular/core/testing';

import { ModalService } from './modal.service';

describe('ModalService', () => {
  let service;
  beforeEach(() => {TestBed.configureTestingModule({});
    service = TestBed.get(ModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it(`should showModal`, () => {
    expect(service.showModal()).toBe(true);
  });

  it(`should hideModal`, () => {
    expect(service.hideModal()).toBe(false);
  });
});
