import { Injectable } from '@angular/core';
import { SBCLoadingService } from '@sbc/components';
import { Observable } from 'rxjs';
import { finalize, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private loadingService: SBCLoadingService) { }

  getAndDownloadFile(service: () => Observable<Blob>, type: string) {
    this.loadingService.show();
    service()
      .pipe(finalize(() => this.loadingService.hide()))
      .pipe(take(1))
      .subscribe(res => this.downloadFile(res, type));
  }

  downloadFile(data: any, type: string) {
    const blob = new Blob([data], { type });
    const url = window.URL.createObjectURL(blob);
    const pwa = window.open(url);
    if (!pwa || pwa.closed || typeof pwa.closed === 'undefined') {
      console.log('Please disable your Pop-up blocker and try again.'); // TODO jasanz: Handle error
    }
  }

}
