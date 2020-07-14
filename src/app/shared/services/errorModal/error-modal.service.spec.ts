import { TestBed } from '@angular/core/testing';

import { ErrorModalService } from './error-modal.service';
import { Router } from '@angular/router';

describe('ErrorModalService', () => {
  let service: ErrorModalService;
  let routerStubSpy: jasmine.SpyObj<Router>;
  beforeEach(() => {
    const spyRouter = jasmine.createSpyObj('Router', ['navigate']);
    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: spyRouter }
      ]
    });
    routerStubSpy = TestBed.get(Router);
    routerStubSpy.navigate.and.callThrough();
    service = TestBed.get(ErrorModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('showModal', () => {
    it('should set statusModal true', () => {
      service.showModal();
      expect(service.statusModal).toBeTruthy();
    });
  });

  describe('hideModal', () => {
    it('should set statusModal true', () => {
      service.hideModal();
      expect(service.statusModal).toBeFalsy();
    });
    it ('should set prime button modal default', () => {
      service.primerButton = {
        text: 'TEXT',
        action: () => false
      };
      service.hideModal();
      service.primerButton.action();
      expect(service.statusModal).toBeFalsy();
    });
  });

  describe('errorTextModal', () => {
    it('should set text modal with the error', () => {
      service.errorTextModal('errorText');
      expect(service.textModal).toEqual('errorText');
    });
  });

  describe('setErrorRoute', () => {
    it('should return undefined if no route', () => {
      expect(service.setErrorRoute(null)).toBeUndefined();
    });
    it('should set button action', () => {
      service.primerButton = {
        text: 'TEXT',
        action: () => false
      };
      spyOn(service, 'hideModal');
      service.setErrorRoute('route');
      service.primerButton.action();
      expect(routerStubSpy.navigate).toHaveBeenCalledWith(['route']);
      expect(service.hideModal).toHaveBeenCalled();
    });
  });
});
