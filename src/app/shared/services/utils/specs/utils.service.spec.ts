import { TestBed, inject } from '@angular/core/testing';

import { UtilsService } from '../utils.service';

describe('shared -> UtilsService', () => {
  let utilsService: UtilsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UtilsService
      ]
    });

    utilsService = TestBed.get(UtilsService);
  });

  it('Should be defined', () => {
    expect(utilsService).toBeDefined();
  });

  it('Should be return copy of object but is not the same object', () => {
    const obj = {
      a: {
        b: 1,
        c: {
          d: 4
        }
      }
    };

    const newObj = utilsService.copyDeepObject(obj);

    expect(obj).toEqual(newObj);
    expect(obj).not.toBe(newObj);

  });

  it('Should be return copy of object but is not the same object', () => {
    const exampleDate = new Date('2019-05-15');
    const exampleMap = new Map();
    exampleMap.set('example', 0);
    const aux = [
      { d: 4 }, { d: 5 }
    ];

    const obj = {
      a: {
        b: 1,
        c: aux,
        exampleDate,
        exampleMap,
        exampleUndefined: null
      }
    };

    const newObj = utilsService.copyDeepObject(obj);

    expect(obj).toEqual(newObj);
    expect(obj).not.toBe(newObj);

    obj.a.c[1] = { d: 10 };

    expect(obj).not.toEqual(newObj);

  });

  describe('openPdf', () => {
    it('should msSaveOrOpenBlob id navigator has msSaveOrOpenBlob function', () => {
      spyOnProperty(window, 'navigator').and.returnValue({ msSaveOrOpenBlob: jasmine.createSpy() });
      utilsService.openPDF('data', 'file');
      expect(window.navigator.msSaveOrOpenBlob).toHaveBeenCalled();
    });
    it('should console log if user agent match FxiOS', () => {
      spyOnProperty(window, 'navigator').and.returnValue({ userAgent: 'ssFxiOSss' });
      spyOn(console, 'log').and.callThrough();
      utilsService.openPDF('data', 'file');
      expect(console.log).toHaveBeenCalledWith('Cannot display on FF iOS');
    });
    it('should use file reader if user agent match CriOS', () => {
      spyOnProperty(window, 'navigator').and.returnValue({ userAgent: 'ssCriOSss' });
      utilsService.openPDF('data', 'file');
    });
    it('should window location href if is an Ipad', () => {
      spyOnProperty(window, 'navigator').and.returnValue({ userAgent: 'iPad' });
      utilsService.openPDF('data', 'file');
    });
    it('should window location href if is an Iphone', () => {
      spyOnProperty(window, 'navigator').and.returnValue({ userAgent: 'iPhone' });
      utilsService.openPDF('data', 'file');
    });
    it('should window open if not previous', () => {
      spyOn(URL, 'createObjectURL').and.returnValue('url');
      spyOn(window, 'open');
      utilsService.openPDF('data', 'file');
      expect(window.open).toHaveBeenCalledWith('url', '_blank');
    });
  });

  describe('redondear', () => {
    it('should return math round if exp is undefined or is 0', () => {
      expect(utilsService.redondear(1, undefined)).toEqual(1);
      expect(utilsService.redondear(1, 0)).toEqual(1);
    });
    it('should return NaN if value is not a number or exp is not an int', () => {
      expect(utilsService.redondear('notanumber', 1.2)).toEqual(NaN);
      expect(utilsService.redondear(1, 1.2)).toEqual(NaN);
    });
    it('should change and round', () => {
      expect(utilsService.redondear(2.22, 2)).toEqual(0);
    });
  });

  describe('validateIban', () => {
    it('should set error if not valid IBAN', () => {
      expect(utilsService.validateIBAN({value: 'ES66210004184'})).toEqual({validLength: true});
      expect(utilsService.validateIBAN({value: 'ES6621000418401234567891'})).toBeFalsy();
      expect(utilsService.validateIBAN({value: 'ES6621000418401234567845'})).toEqual({validIban: true});


    });
  });

  describe('openExcel', () => {
    it('should open excel if IE', () => {
      const file = 'file';
      utilsService.openExcel(file);
      spyOnProperty(window, 'navigator').and.returnValue({ msSaveBlob: jasmine.createSpy() });
      utilsService.openExcel(file, 'name');
      expect(window.navigator.msSaveBlob).toHaveBeenCalledWith(new Blob([utilsService.s2ab(atob('file'))], { type: 'text/plain' }), 'name');
    });
  });

});
