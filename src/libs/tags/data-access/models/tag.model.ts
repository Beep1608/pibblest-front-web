// src/libs/tags/data-access/models/tag.model.ts
export interface Tag {
  id: number;
  name: string;
  usageCount: number;
}

export interface TagPageResponse {
  last: boolean;
  pageNo: number;
  pageSize: number;
  tags: Tag[];
  totalElements: number;
  totalPages: number;
}

export interface CreateTagRequest {
  name: string;
}