export interface Paginated<T> {
  data: T[];

  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  //from json to typescript
  links: {
    first: string;
    last: string;
    current: string;
    next: string;
    previous: string;
  };
}
