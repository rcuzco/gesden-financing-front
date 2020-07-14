import { TestBed } from '@angular/core/testing';

import { GesdenService } from './gesden.service';
import { SessionService } from '../session';

describe('GesdenService', () => {
  let service: GesdenService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: SessionService, useValue: { getItem: () => 'sessionItem', setItem: () => true}}
      ]
    });
    service = TestBed.get(GesdenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it(`should getCenterId 1`, () => {
    expect(service.getCenterId()).toBe('sessionItem');
  });

  it(`should getCenterId 2`, () => {
    service.centerId = '2';
    expect(service.getCenterId()).toBe('2');
  });

  it(`should setCenterId 1`, () => {
    service.setCenterId('2');
    expect(service.centerId).toBe('2');
  });

  it(`should getPatientId 1`, () => {
    service.patientId  = undefined;
    expect(service.getPatientId()).toBe('sessionItem');
  });

  it(`should getPatientId 2`, () => {
    service.patientId  = '2';
    expect(service.getPatientId()).toBe('2');
  });

  it(`should setPatientId 1`, () => {
    service.setPatientId('2');
    expect(service.patientId ).toBe('2');
  });

  it(`should getCustomerId 1`, () => {
    service.customerId = undefined;
    expect(service.getCustomerId()).toEqual('sessionItem');
  });

  it(`should getCustomerId 2`, () => {
    service.customerId  = '2';
    expect(service.getCustomerId()).toBe('2');
  });

  it(`should setCustomerId 1`, () => {
    service.setCustomerId('2');
    expect(service.customerId ).toBe('2');
  });

  it(`should getUserId 1`, () => {
    service.userId = undefined;
    expect(service.getUserId()).toEqual('sessionItem');
  });

  it(`should getUserId 2`, () => {
    service.userId = '2';
    expect(service.getUserId()).toBe('2');
  });

  it(`should setUserId 1`, () => {
    service.setUserId('2');
    expect(service.userId).toBe('2');
  });

});
