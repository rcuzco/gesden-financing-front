export interface AddDocumentationRequestParams {
  iban: string;
  isIbanTitular: boolean;
  deleteDocument?: boolean;
}

export interface AddDocumentationRequestResponse {
  bankDocument: string;
  command: string;
  iban: string;
  ibanTitular: boolean;
  nifClient: string;
  requestAttachment: string;
  nifPatient?: string;
}

export interface IBANValidation {
  validLength?: boolean;
  validIban?: boolean;
}
