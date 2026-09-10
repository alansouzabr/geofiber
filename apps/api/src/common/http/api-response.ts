export type ApiMeta = Record<string, any>;

export type ApiResponse<T> = {
  data: T;
  meta?: ApiMeta;
};

export function ok<T>(data: T, meta?: ApiMeta): ApiResponse<T> {
  return meta ? { data, meta } : { data };
}
