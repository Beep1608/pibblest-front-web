// src/libs/stores/data-access/lib/models/store.model.ts
import { Product } from "../../../../products/data-access/lib/models/product.model";
import { PageRequest } from "../../../../shared/data-access/models/sort.model";

export enum StoreStatus {
  ACTIVE = 'active',
  CLOSED = 'closed',
  MAINTENANCE = 'maintenance',
  PRE_ACTIVE = 'pre-active',
}

export interface Store {
  id: number;
  name: string;
  address: string;
  status: StoreStatus;
}

export interface CreateStoreDto {
  name: string;
  address: string;
  status: StoreStatus;
}

export interface StorePreview {
  id: number;
  name: string;
  address: string;
  status: string;
  totalProducts: number;
  currentQuantityOfProducts: number;
  salesOfToday: number;
  totalSalesRevenue: number;
  operatinTime: string;
  growthFromStart: number;
  employees: number;
}

export interface StorePaginationResponse{
    last: boolean,
    pageNo: number,
    pageSize: number,
    totalElements: number,
    totalPages: number,
    stores: StorePreview[]
}

