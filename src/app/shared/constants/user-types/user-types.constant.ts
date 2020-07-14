import { STATUS } from '../status-request';

export const USER_TYPES = {
  CLINIC: {
    id: 1,
    value: '',
    selectedStatus: [STATUS.REQUEST_OK, STATUS.REQUEST_REVIEW_DOC],
    accessDetailStatus: [
      STATUS.REQUEST_OK.id,
      STATUS.REQUEST_VALIDATE_DOC.id,
      STATUS.REQUEST_APPROVED.id,
      STATUS.REQUEST_FINISH.id,
      STATUS.REQUEST_INOK.id,
      STATUS.REQUEST_KO.id,
      STATUS.REQUEST_REVIEW_DOC.id
    ]},
  FINANCING: {
    id: 2,
    value: '',
    selectedStatus:
    [STATUS.REQUEST_VALIDATE_DOC],
    accessDetailStatus: [
      STATUS.REQUEST_OK.id,
      STATUS.REQUEST_VALIDATE_DOC.id,
      STATUS.REQUEST_APPROVED.id,
      STATUS.REQUEST_FINISH.id,
      STATUS.REQUEST_INOK.id,
      STATUS.REQUEST_KO.id,
      STATUS.REQUEST_REVIEW_DOC.id
    ]}
};
