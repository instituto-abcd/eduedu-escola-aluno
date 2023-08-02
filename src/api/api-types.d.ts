import { UseMutationOptions, UseQueryOptions } from "@tanstack/react-query";

export type BaseResponse<T> = {
  success: boolean;
  data?: T;
  errors?: ApiError;
};

type ApiError = {
  code: string;
  message: string;
};

export type BaseError = Required<Omit<BaseResponse<void>, "data">>;

export type MutationOptions<Input = unknown, Response = unknown> = Omit<
  UseMutationOptions<Response, ApiError, Input, unknown>,
  "mutationFn"
>;

export type QueryOptions<
  Output,
  Key,
  Input = Output,
  Err = ApiError
> = UseQueryOptions<Output, Err, Input, Key> & {
  page?: number;
  pageSize?: number;
};

export type PaginationOptions = {
  totalItems: number;
  pageSize: number;
  pageNumber: number;
  totalPages: number;
  previousPage: number;
  nextPage: number;
  lastPage: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
};

export type Paginated<T> = {
  items: T[];
  pagination: PaginationOptions;
};

export type PaginationParams = {
  "page-number"?: number;
  "page-size"?: number;
};
