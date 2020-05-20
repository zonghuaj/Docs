export interface TPNode {
  name: string;
  count: number;
}

export interface TPNodeDetail {
  name: string;
  type: string;
  sla?: string;
  cpm?: string;
  latency?: string;
}

export interface TPCallDetail {
  times: string[];
  timeTrend: number[];
  throughputTrend: number[];
  slaTrend: number[];
}
