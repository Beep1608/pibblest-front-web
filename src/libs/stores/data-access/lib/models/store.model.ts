import { PageRequest } from "../../../../shared/data-access/models/sort.model";


export interface StorePreview {
  id: number; 
  name: string;
  address: string; 
  status: string;
  growthFromStart?: number;
  employees?: number;
  salesOfToday?: number;
  createdAt: string;
  totalProducts?: number;
  currentQuantityOfProducts?: number;
}

export interface StorePaginationResponse{
    last: boolean,
    pageNo: number,
    pageSize: number,
    totalElements: number,
    totalPages: number,
    stores: StorePreview[]
}