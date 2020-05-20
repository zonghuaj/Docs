export interface AlertEntity {
  id?: number;
  status: number;
  alert_level: string;
  starts_at: Date;
  solution?: string;
  claim_user: string;
  summary: string;
  description: string;
}

export interface AlertListEntity {
  rows: AlertEntity[];
  count: number;
}
