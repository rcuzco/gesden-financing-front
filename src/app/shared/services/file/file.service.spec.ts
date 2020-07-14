import { inject, TestBed } from '@angular/core/testing';
import { SBCLoadingModule } from '@sbc/components';
import { of } from 'rxjs';
import { FileService } from './file.service';

describe('FileService', () => {
  let service: FileService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SBCLoadingModule],
      providers: [FileService]
    });
    service = TestBed.get(FileService);
  });

  it('should be defined', inject([FileService], (service: FileService) => {
    expect(service).toBeDefined();
  }));

  it('should get and download a file', () => {
    spyOn(window.URL, 'createObjectURL').and.returnValue('fakeUrl');
    spyOn(window, 'open');

    service.getAndDownloadFile(() => of(new Blob(['Prueba'.toString()])), 'application/pdf');

    expect(window.URL.createObjectURL).toHaveBeenCalledWith(new Blob(['Prueba'.toString()], { type: 'application/pdf' }));
    expect(window.open).toHaveBeenCalledWith('fakeUrl');
  });

  it('should get and download a file', () => {
    spyOn(window.URL, 'createObjectURL').and.returnValue('fakeUrl');
    spyOn(window, 'open');

    service.getAndDownloadFile(() => of(new Blob(['Prueba'.toString()])), 'application/pdf');

    expect(window.URL.createObjectURL).toHaveBeenCalledWith(new Blob(['Prueba'.toString()], { type: 'application/pdf' }));
    expect(window.open).toHaveBeenCalledWith('fakeUrl');
  });

  it('should have a downloadFile that controls if there is a pop up blocker', () => {
    spyOn(console, 'log').and.callThrough();
    service.downloadFile(new Blob(['Prueba'.toString()]), 'application/pdf');
    expect(console.log).not.toHaveBeenCalled();
  });
});
