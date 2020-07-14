import { TestBed } from '@angular/core/testing';
import { ErrorManagerService } from '../errorManager.service';

describe('SessionService', () => {
  let service: ErrorManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ErrorManagerService]
    });
    service = TestBed.get(ErrorManagerService);
  });

  describe('getMessageAndNavigate', () => {
    it('should return default obj if no error', () => {
      expect(service.getMessageAndNavigate(null)).toEqual({
        route: null, message: 'ERROR.DEFAULT_MESSAGE'
      });
    });
    it('should return error obj from constant if match with controlled errors', () => {
      expect(service.getMessageAndNavigate({code: 'PF-904'})).toEqual({
        route: null, message: 'ERROR.PF-904'
      });
    });
    it('shoul return default error obj if no match with controlled errors', () => {
      expect(service.getMessageAndNavigate({code: 'nomatch'})).toEqual({
        route: null, message: 'ERROR.DEFAULT_MESSAGE',
      });
    });
  });
});
