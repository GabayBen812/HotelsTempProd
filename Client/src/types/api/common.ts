export interface Name {
  en: string;
  he: string;
  ar: string;
}

export interface BaseEntity {
  id: string;
  name: Name;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface ApiError {
  message: string;
  code: string;
  status: number;
} 