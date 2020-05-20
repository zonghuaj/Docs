export interface NetResult<T> {
  code: number;
  error: NetError;
  data: T;
}

export interface NetError {
  code?: number;
  message?: string;
  extra?: any;
}

