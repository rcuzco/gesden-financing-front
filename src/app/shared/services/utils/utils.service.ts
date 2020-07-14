import { Injectable } from '@angular/core';
import { IBANValidation } from '../../models';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  public redondear(value, exp) {
    if (typeof exp === 'undefined' || +exp === 0) {
      return Math['round'](value);
    }
    value = +value;
    exp = +exp;
    // Si el valor no es un número o el exp no es un entero...
    if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
      return NaN;
    }
    // Cambio
    value = value.toString().split('e');
    value = Math['round'](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
    // Volver a cambiar
    value = value.toString().split('e');
    return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
  }

  openPDF(data: string, fileName: string) {
    const byteCharacters = atob(data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/pdf' });
    if (window.navigator.msSaveOrOpenBlob) { // IE 11+
      window.navigator.msSaveOrOpenBlob(blob, fileName);
    }
    else if (navigator.userAgent.match('FxiOS')) { // FF iOS
      console.log('Cannot display on FF iOS');
    }
    else if (navigator.userAgent.match('CriOS')) { // Chrome iOS
      const reader = new FileReader();
      reader.onloadend = function () { window.open(reader.result as string); };
      reader.readAsDataURL(blob);
    }
    else if (navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPhone/i)) { // Safari & Opera iOS
      const url = window.URL.createObjectURL(blob);
      window.location.href = url;
    }
    else {
      const url = URL.createObjectURL(blob);
      setTimeout(function () {
        // For Firefox it is necessary to delay revoking the ObjectURL
        window.URL.revokeObjectURL(url);
      }, 100);
      window.open(url, '_blank');
    }
  }

  openExcel(data, name?: string){
    const documentName = name || 'excel.csv';
    const blob = new Blob([this.s2ab(atob(data))], { type: 'text/plain' });
    if (window.navigator && window.navigator.msSaveBlob) {
      window.navigator.msSaveBlob(blob, documentName);
    }
    else {
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.setAttribute('download', documentName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  s2ab(s) {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    // tslint:disable-next-line:no-bitwise
    for (let i = 0; i !== s.length; ++i) { view[i] = s.charCodeAt(i) & 0xFF; }
    return buf;
  }

  openFile(data: Blob, fileName: string, typeFile: string) {
    const extensionMap = {
      png: 'image/png',
      pdf: 'application/pdf',
      jpg: 'image/jpg',
      jpeg: 'image/jpeg'
    };
    const blob = new Blob([data], { type: extensionMap[typeFile] || 'application/pdf' });
    if (window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(blob, fileName + '.' + typeFile);
    }
    else {
      const url = URL.createObjectURL(blob);
      if (navigator.userAgent.match(/Firefox/i)) {
        setTimeout(function () {
          // For Firefox it is necessary to delay revoking the ObjectURL
          window.URL.revokeObjectURL(url);
        }, 100);
      }
      window.open(url, '_blank');
    }
  }

  copyDeepObject(originalObj: any): any {
    const constructedObj = Object.create(originalObj);
    for (const i in originalObj) {
      if (typeof originalObj[i] === 'object') {
        constructedObj[i] = this.deepClone(originalObj[i]);
      } else {
        constructedObj[i] = originalObj[i];
      }
    }
    return constructedObj;
  }

  parseToNumber(str: string): number {
    return parseFloat(str.replace(',', '.').replace(' ', ''));
  }

  validateIBAN = (formControl): IBANValidation  => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numControl = 10;
    const ibanLettersLength = 2;
    const ibanAuxLength = 6;
    const ibanDefaultLength = 24;
    let IBAN = formControl.value;
    let letter1;
    let letter2;
    let num1;
    let num2;
    let isbanaux;

    IBAN = IBAN.toUpperCase();
    IBAN = IBAN.trim();

    if (!IBAN.length) {
      return;
    }

    if (IBAN.length !== ibanDefaultLength) {
      return { validLength: true };
    }

    letter1 = IBAN.substring(0, 1);
    letter2 = IBAN.substring(1, ibanLettersLength);
    num1 = letters.search(letter1) + numControl;
    num2 = letters.search(letter2) + numControl;
    isbanaux = String(num1) + String(num2) + IBAN.substring(ibanLettersLength);
    isbanaux = isbanaux.substring(ibanAuxLength) + isbanaux.substring(0, ibanAuxLength);
    const resto = this.module97(isbanaux);
    if (resto === '1') {
      return;
    } else {
      return { validIban: true };
    }
  }

  private deepClone(oldObj) {
    let newObj;
    // Handle the 3 simple types, and null or undefined
    if (null == oldObj || 'object' !== typeof oldObj) {
      return oldObj;
    }
    // Handle Date
    if (oldObj instanceof Date) {
      newObj = new Date();
      newObj.setTime(oldObj.getTime());
      return newObj;
    }
    // Handle Array
    if (oldObj instanceof Array) {
      newObj = [];
      for (let i = 0; i < oldObj.length; i++) {
        newObj[i] = this.deepClone(oldObj[i]);
      }
      return newObj;
    }
    // Handle Map
    if (oldObj instanceof Map) {
      newObj = new Map(oldObj);
      return newObj;
    }
    // Handle Object
    if (oldObj instanceof Object) {
      newObj = Object.create(oldObj);
      for (const attr in oldObj) {
        if (oldObj.hasOwnProperty(attr)) {
          newObj[attr] = this.deepClone(oldObj[attr]);
        } else {
          newObj[attr] = oldObj[attr];
        }
      }
      return newObj;
    }
    throw new Error("Unable to copy obj! Its type isn't supported.");
  }

  private module97(iban) {
    const numParts = 7;
    const subs = 97;
    const parts = Math.ceil(iban.length / numParts);
    let remainer = '';

    for (let i = 1; i <= parts; i++) {
      remainer = String(parseFloat(remainer + iban.substr((i - 1) * numParts, numParts)) % subs);
    }

    return remainer;
  }

}
