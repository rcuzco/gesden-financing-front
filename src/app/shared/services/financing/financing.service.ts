import { GesdenService } from './../gesden/gesden.service';
import { Injectable } from '@angular/core';
import { ApiService, EnvironmentService, API_CALL_URL } from '..';
import { HttpClient, HttpParams, HttpHeaders, HttpRequest, HttpEvent } from '@angular/common/http';
import { FinancingRequest } from '../../models/financing-requests/financing-requests.model';
import { GESDENPARAMS } from '../../constants/gesden-params/gesden-params';
import { STATUS } from '../../constants/status-request';
import { SessionService } from '../session';
import { of, Observable } from 'rxjs';
import { DatePipe } from '@angular/common';
import { map } from 'rxjs/operators';
import { AddDocumentationRequestParams, AddDocumentationRequestResponse } from '../../models';

@Injectable({
  providedIn: 'root'
})
export class FinancingService {

  public requestId: string;
  public requestToAddDoc: FinancingRequest;

  constructor(
    private api: ApiService,
    private envConf: EnvironmentService,
    private http: HttpClient,
    private gesdenService: GesdenService,
    private sessionService: SessionService,
    private datePipe: DatePipe
    ) { }

  financingRequestsPreview(){
    const url = this.envConf.data.apiUrl + this.envConf.data.contexts.APIS + API_CALL_URL.FINANCING_REQUESTS_PREVIEW.path;
    let queryParameters = new HttpParams();
    queryParameters = queryParameters.set(GESDENPARAMS.PATIENTID.value, this.gesdenService.getPatientId());
    queryParameters = queryParameters.set(GESDENPARAMS.CUSTOMERID.value, this.gesdenService.getCustomerId());
    queryParameters = queryParameters.set(GESDENPARAMS.CENTERID.value, this.gesdenService.getCenterId());
    return this.http.get<FinancingRequest>(url, {params: queryParameters});
  }

  financingRequestsID(idRequest: string){
    const urlPath = this.envConf.data.apiUrl + this.envConf.data.contexts.APIS;
    const apiInstance = this.api.getApiInstance(API_CALL_URL.FINANCING_REQUESTS_ID);
    apiInstance.params.id.value = idRequest;
    const url = this.api.getApiUrl(urlPath, apiInstance);
    return this.http.get<FinancingRequest>(url);
  }

  financingRequests(){
    const url = this.envConf.data.apiUrl + this.envConf.data.contexts.APIS + API_CALL_URL.FINANCING_REQUESTS.path;
    const body = {
      'patientId': +this.gesdenService.getPatientId(),
      'customerId': +this.gesdenService.getCustomerId(),
      'centerId': +this.gesdenService.getCenterId(),
      'userId': this.gesdenService.getUserId()
    };
    return this.http.post<FinancingRequest>(url, body);
  }

  getFinancingRequests(filter: any, page: number){
    const url = this.envConf.data.apiUrl + this.envConf.data.contexts.APIS + API_CALL_URL.FINANCING_REQUESTS.path;
    let queryParameters = new HttpParams();
    queryParameters = queryParameters.set(GESDENPARAMS.CENTERID.value, filter.center ? filter.center : '');
    queryParameters = queryParameters.set('dateOfCreationFrom', filter.dateFrom ? this.datePipe.transform(filter.dateFrom, 'yyyy-MM-dd') : null);
    queryParameters = queryParameters.set('dateOfCreationTo', filter.dateTo ? this.datePipe.transform(filter.dateTo, 'yyyy-MM-dd') : null);
    queryParameters = queryParameters.set('page', page.toString());
    queryParameters = queryParameters.set('size', '5');
    queryParameters = queryParameters.set('requestStatus', filter.status ? filter.status : '');
    queryParameters = queryParameters.set('medicalRecordId', filter.numberHistory ? filter.numberHistory : '');
    queryParameters = queryParameters.set('id', filter.numberRequest ? filter.numberRequest : '');
    queryParameters = queryParameters.set('sort', filter.sort);
    return this.http.get<FinancingRequest>(url, {params: queryParameters});
  }

  getFinancingRequestExcel(filter) {
    const url = this.envConf.data.apiUrl + this.envConf.data.contexts.APIS + API_CALL_URL.FINANCING_REQUESTS_EXCEL.path;
    let queryParameters = new HttpParams();
    queryParameters = queryParameters.set(GESDENPARAMS.CENTERID.value, filter.center ? filter.center : '');
    queryParameters = queryParameters.set('dateOfCreationFrom', filter.dateFrom ? this.datePipe.transform(filter.dateFrom, 'yyyy-MM-dd') : null);
    queryParameters = queryParameters.set('dateOfCreationTo', filter.dateTo ? this.datePipe.transform(filter.dateTo, 'yyyy-MM-dd') : null);
    queryParameters = queryParameters.set('requestStatus', filter.status ? filter.status : '');
    queryParameters = queryParameters.set('medicalRecordId', filter.numberHistory ? filter.numberHistory : '');
    queryParameters = queryParameters.set('id', filter.numberRequest ? filter.numberRequest : '');
    queryParameters = queryParameters.set('sort', 'creationDate');
    return this.http.get(url, {params: queryParameters}).pipe(
      map((res: any) => {
        return res.fileInBase64;
      })
    );
  }

  fetchCommand(idRequest, iban) {
    const urlPath = this.envConf.data.apiUrl + this.envConf.data.contexts.APIS;
    const apiInstance = this.api.getApiInstance(API_CALL_URL.FINANCING_REQUESTS_GENERATE_MANDATE);
    apiInstance.params.id.value = idRequest;
    const url = this.api.getApiUrl(urlPath, apiInstance);
    const body = this.generateIbanBody(iban);
    return this.http.post(url, body, {responseType: 'blob'});
  }

  financingIntervals(){
    const url = this.envConf.data.apiUrl + this.envConf.data.contexts.APIS + API_CALL_URL.FINANCING_INTERVALS.path;
    return this.http.get<FinancingRequest>(url);
  }

  financingRequestsIDTerms(idRequest, budget){
    const urlPath = this.envConf.data.apiUrl + this.envConf.data.contexts.APIS;
    const apiInstance = this.api.getApiInstance(API_CALL_URL.FINANCING_REQUESTS_ID_TERMS);
    apiInstance.params.id.value = idRequest;
    const url = this.api.getApiUrl(urlPath, apiInstance);
    const body = budget;
    return this.http.put<any>(url, body);
  }

  getAddDocRequest() {
    return this.requestToAddDoc;
  }

  getDocument(idRequest, documentName) {
    const urlPath = this.envConf.data.apiUrl + this.envConf.data.contexts.APIS;
    const apiInstance = this.api.getApiInstance(API_CALL_URL.FINANCING_REQUEST_GET_DOC);
    apiInstance.params.id.value = idRequest;
    apiInstance.params.documentName.value = documentName;
    const url = this.api.getApiUrl(urlPath, apiInstance);
    return this.http.get(url, {responseType: 'blob', observe: 'response'});
  }

  getFinancingRequestsIDTermsPdf(idRequest){
    const urlPath = this.envConf.data.apiUrl + this.envConf.data.contexts.APIS;
    const apiInstance = this.api.getApiInstance(API_CALL_URL.FINANCING_REQUESTS_ID_TERMS_PDF);
    apiInstance.params.id.value = idRequest;
    const url = this.api.getApiUrl(urlPath, apiInstance);
    return this.http.get(url, {responseType: 'blob'});
  }

  public getRequestId(){
    if (!this.requestId) {
      const requestId = this.sessionService.getItem(GESDENPARAMS.REQUESTID.value);
      this.setRequestId(requestId);
    }
    return this.requestId;
  }

  public setRequestId(requestId: string){
    this.requestId = requestId;
    if (this.requestId){
      this.sessionService.setItem(GESDENPARAMS.REQUESTID.value, this.requestId);
    }
  }

  setDocumentationStatus(idRequest, data) {
    const urlPath = this.envConf.data.apiUrl + this.envConf.data.contexts.APIS;
    const apiInstance = this.api.getApiInstance(API_CALL_URL.FINANCING_REQUEST_DOC_VALIDATION);
    apiInstance.params.id.value = idRequest;
    const url = this.api.getApiUrl(urlPath, apiInstance);
    const body = data;
    return this.http.put<any>(url, body);
  }

  sendRequestDocumentation(idRequest: number, documents: FormData, paramData: AddDocumentationRequestParams): Observable<AddDocumentationRequestResponse> {
    const urlPath = this.envConf.data.apiUrl + this.envConf.data.contexts.APIS;
    const apiInstance = this.api.getApiInstance(API_CALL_URL.FINANCING_REQUEST_DOC_ATTACHMENTS);
    apiInstance.params.id.value = idRequest;
    const url = this.api.getApiUrl(urlPath, apiInstance);
    const deleteDocument = !!paramData.deleteDocument;
    const headers = new HttpHeaders();
    const params = new HttpParams(
      {
        fromObject: {
          iban: paramData.iban.toUpperCase(),
          isIbanTitular: paramData.isIbanTitular.toString(),
          deleteDocument: deleteDocument.toString()
        }
      }
    );
    headers.append('Content-Type', 'multipart/form-data');
    headers.append('Accept', 'application/json');
    return this.http.put<AddDocumentationRequestResponse>(url, documents, {headers: headers, params: params});
  }

  getMandate() {
    const routeMandato = 'assets/img/Mandato.pdf';
    if (window.navigator.msSaveOrOpenBlob) {
      const routeHttp = window.location.origin + window.location.pathname + routeMandato;
      this.http.get(routeHttp, {responseType: 'blob'}).subscribe(res => {
        const blob = new Blob([res], { type: 'application/pdf' });
        window.navigator.msSaveOrOpenBlob(blob, routeHttp.split('/').pop());
      });
    } else {
      window.open('./' + routeMandato, '_blank');
    }
  }

  private generateIbanBody(iban) {
    const ibanStr = iban.toUpperCase();
    return {
      iban: ibanStr.slice(0, 4),
      ibanEntidad: ibanStr.slice(4, 8),
      ibanOficina: ibanStr.slice(8, 12),
      ibanDC: ibanStr.slice(12, 14),
      ibanCta:  ibanStr.slice(14, 24)
    };
  }
}
