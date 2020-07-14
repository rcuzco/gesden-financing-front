import { FinancingCheckDetail } from './financing-check-detail.model';
import { FinancingPeople } from './financing-people.model';

export interface FinancingRequest {
  id: number;
  userId: string;
  patient: FinancingPeople;
  customer: FinancingPeople;
  status: number;
  financingCheckDetail?: FinancingCheckDetail;
  financingBudgetDetails: any;
  financingRequestDetail: any;
  documentAttachment?: any;
  iban?: string;
  initdate?: string;
}
