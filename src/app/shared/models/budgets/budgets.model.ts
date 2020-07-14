export interface Content {
  id: number;
  description: string;
  status: string;
  date: string;
  amount: number;
  checked?: boolean;
}

export interface Sort {
  unsorted: boolean;
  sorted: boolean;
}

export interface Sort2 {
  unsorted: boolean;
  sorted: boolean;
}

export interface Pageable {
  offset: number;
  sort: Sort2;
  paged: boolean;
  pageSize: number;
  pageNumber: number;
  unpaged: boolean;
}

export interface Budget {
  totalElements: number;
  totalPages: number;
  size: number;
  content: Content[];
  number: number;
  sort: Sort;
  numberOfElements: number;
  first: boolean;
  pageable: Pageable;
  last: boolean;
}
