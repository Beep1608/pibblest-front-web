// src/libs/stores/data-access/lib/models/store.model.ts
import { Tag } from "../../../../tags/data-access/models/tag.model";

export enum StoreStatus {
  ACTIVE = 'ACTIVE',
  CLOSED = 'CLOSED',
  MAINTENANCE = 'MAINTENANCE',
  PRE_OPENING = 'PRE_OPENING',
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
  tagsId: number[];
}

export interface UpdateStoreRequest {
  name: string;
  address: string;
  status: StoreStatus;
  tagsId: number[];
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
