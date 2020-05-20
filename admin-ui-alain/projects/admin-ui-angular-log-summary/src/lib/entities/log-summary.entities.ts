import { STData } from '@delon/abc';

export interface SummaryLogListEntity {
  count: number;
  rows: SummaryLog[];
}

export interface SummaryLog extends STData {
  timestamp: string;
  time?: Date;
  content: string;
  service: string;
  pod: string;
}
