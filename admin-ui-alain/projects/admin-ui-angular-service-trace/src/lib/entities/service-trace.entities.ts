export interface ServTrace {
  key: string;
  endpointNames: string[];
  duration: number;
  start: string;
  isError: boolean;
  traceIds: string[];
}
