export const API_CALL_URL = {
  AUTH: {
    path: '/token',
    params: {}
  },
  USERS: {
    path: '/users',
    params: {
      userId: {
        key: 'userId',
        value: ''
      },
      centerId: {
        key: 'centerId',
        value: ''
      },
      patientId: {
        key: 'patientId',
        value: ''
      },
      customerId: {
        key: 'customerId',
        value: ''
      }
    }
  },
  USERS_ID: {
    path: '/users/{id}',
    params: {
      id: {
        key: 'id',
        value: ''
      }
    }
  },
  FINANCING_REQUESTS: {
    path: '/financing-requests',
    params: {
      dateOfCreationFrom: {
        key: 'dateOfCreationFrom',
        value: ''
      },
      dateOfCreationTo: {
        key: 'dateOfCreationTo',
        value: ''
      },
      centerId: {
        key: 'centerId',
        value: ''
      },
    }
  },
  FINANCING_REQUESTS_PREVIEW: {
    path: '/financing-requests/preview',
    params: {
      patientId: {
        key: 'patientId',
        value: ''
      },
      customerId: {
        key: 'customerId',
        value: ''
      },
    }
  },
  FINANCING_REQUESTS_EXCEL: {
    path: '/financing-requests/getExcel'
  },
  FINANCING_REQUESTS_ID: {
    path: '/financing-requests/{id}',
    params: {
      id: {
        key: 'id',
        value: ''
      }
    }
  },
  FINANCING_REQUESTS_ID_TERMS: {
    path: '/financing-requests/{id}/terms',
    params: {
      id: {
        key: 'id',
        value: ''
      }
    }
  },
  FINANCING_REQUESTS_ID_TERMS_PDF: {
    path: '/financing-requests/{id}/terms-pdf',
    params: {
      id: {
        key: 'id',
        value: ''
      }
    }
  },
  FINANCING_REQUESTS_GENERATE_MANDATE: {
    path: '/financing-requests/{id}/mandate-pdf',
    params: {
      id: {
        key: 'id',
        value: ''
      }
    }
  },
  FINANCING_REQUEST_DOC_ATTACHMENTS: {
    path: '/financing-requests/{id}/attachments',
    params: {
      id: {
        key: 'id',
        value: ''
      }
    }
  },
  FINANCING_REQUEST_GET_DOC: {
    path: '/financing-requests/getDocument/{id}/{documentName}',
    params: {
      id: {
        key: 'id',
        value: ''
      },
      documentName: {
        key: 'documentName',
        value: ''
      }
    }
  },
  FINANCING_REQUEST_DOC_VALIDATION: {
    path: '/financing-requests/{id}/document-validation',
    params: {
      id: {
        key: 'id',
        value: ''
      }
    }
  },
  FINANCING_INTERVALS: {
    path: '/financing-intervals'
  },
  BUDGETS: {
    path: '/budgets',
    params: {
      patientId: {
        key: 'patientId',
        value: ''
      },
      dateOfCreationFrom: {
        key: 'dateOfCreationFrom',
        value: ''
      },
      dateOfCreationTo: {
        key: 'dateOfCreationTo',
        value: ''
      },
    }
  },
};
