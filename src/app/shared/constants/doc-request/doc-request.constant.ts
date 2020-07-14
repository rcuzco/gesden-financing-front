export const DOC_REQUEST = [
  {
    name: 'Documento del paciente',
    id: 'Paciente_nif',
    requestId: 'nifPatient',
    downloadName: 'documento_paciente',
    showName: 'Documento_paciente',
    required: false,
    document: true
  },
  {
    name: 'Documento del cliente',
    id: 'Cliente_nif',
    requestId: 'nifClient',
    downloadName: 'documento_cliente',
    showName: 'Documento_cliente',
    required: true,
    document: true
  },
  {
    name: 'Documento bancario',
    id: 'Documento_bancario',
    requestId: 'bankDocument',
    downloadName: 'documento_bancario',
    showName: 'Documento_bancario',
    required: true,
    document: true
  },
  {
    name: 'Solicitud',
    id: 'Nombre_solicitud',
    requestId: 'requestAttachment',
    downloadName: 'solicitud',
    showName: 'Solicitud',
    required: true,
    document: true
  },
  {
    name: 'Mandato',
    id: 'Mandato',
    requestId: 'command',
    downloadName: 'mandato',
    showName: 'Mandato',
    required: true,
    document: true
  },
  {
    name: 'IBAN',
    id: 'iban',
    required: true,
    document: false
  },
  {
    name: 'Titular IBAN',
    id: 'isIbanTitular',
    required: true,
    document: false
  }
];

