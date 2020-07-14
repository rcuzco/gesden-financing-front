import { TestBed } from '@angular/core/testing';
import { StateService } from '../state.service';


describe('StateService', () => {
  let service: StateService;

  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [],
    });
    service = TestBed.get(StateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('setLoginErrorModalId', () => {
    it ('should set login error modal id', () => {
      spyOn(service.modalsIds$, 'next');
      service.setLoginErrorModalId('id');
      expect(service.modalsIds.loginError).toEqual('id');
      expect(service.modalsIds$.next).toHaveBeenCalledWith({loginError: 'id'});
    });
  });
});
