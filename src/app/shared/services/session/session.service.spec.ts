import { TestBed } from '@angular/core/testing';
import { SessionService } from './session.service';


const fakeSessionStorage = {
  token: 'some token',
};

const mockSessionStorage = {
  getItem: (key: string): string => {
    return key in fakeSessionStorage ? fakeSessionStorage[key] : null;
  },
  setItem: (key: string, value: string) => {
    fakeSessionStorage[key] = `${value}`;
  },
  removeItem: (key: string) => {
    delete fakeSessionStorage[key];
  }
};

describe('SessionService', () => {
  let service: SessionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SessionService]
    });
    service = TestBed.get(SessionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have a getToken method', () => {
    spyOn(sessionStorage, 'getItem')
    .and.callFake(mockSessionStorage.getItem);
    expect(service.getItem('token')).toBe('some token');
  });

  it('should expose a setToken method', () => {
    spyOn(sessionStorage, 'setItem').and.callFake(mockSessionStorage.setItem);
    service.setItem('tokenName', 'token vale');
    expect(sessionStorage.setItem).toHaveBeenCalledWith('tokenName', 'token vale');
  });

  it('should expose a removeItem method', () => {
    spyOn(sessionStorage, 'removeItem')
    .and.callFake(mockSessionStorage.removeItem);
    service.removeItem('itemName');
    expect(sessionStorage.removeItem).toHaveBeenCalledWith('itemName');
  });

});
