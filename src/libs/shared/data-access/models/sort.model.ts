export interface Sort{
    empty: boolean,
    sorted: boolean,
    unsorted: boolean

}

export interface PageRequest{
    page: number,
    size:   number,
    sort: string
}

export interface SpringPage<T>{
    content: T[],
    pageable: any,
    last: boolean,
    totalPages: number,
    totalElements: number,
    size: number,
    number: number, 
    sort: Sort,
    first: boolean,
    numberOfElements: number,
    empty: boolean
}
