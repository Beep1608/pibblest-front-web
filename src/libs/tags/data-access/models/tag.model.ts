export interface Tag {
  name: string;
  id: number;
}

export interface TagPageResponse {
  last: boolean;
  pageNo: number;
  pageSize: number;
  tags: Tag[];
  totalElements: number;
  totalPages: number;
}

export interface TagForProductDto {
    name: string;
    id: number;
}

export interface GetAllProductTagsListResponse {
    tags: TagForProductDto[];
}