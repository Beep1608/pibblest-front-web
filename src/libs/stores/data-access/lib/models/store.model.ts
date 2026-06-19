// src/libs/stores/data-access/lib/models/store.model.ts
import { Tag } from "../../../../tags/data-access/models/tag.model";

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
  timezone: string;
  tagsId: number[];
}

export interface UpdateStoreRequest {
  name: string;
  address: string;
  status: StoreStatus;
  timezone: string;
  tagsId: number[];
}

export interface StorePreview {
  id: number;
  name: string;
  address: string;
  status: string;
  timezone?: string;
  totalProducts: number;
  currentQuantityOfProducts: number;
  salesOfToday: number;
  totalSalesRevenue: number;
  operatinTime: string;
  growthFromStart: number;
  employees: number;
  tags?: Tag[];
}

export interface StorePaginationResponse {
    last: boolean;
    pageNo: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    stores: StorePreview[];
}
