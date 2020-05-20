export interface AlertRuleEntity {
  id: number;
  name: string;
  description?: string;
  receiveGroup: string[];
  enable?: boolean;
  level: string;
  status: number;
  services?: SerVerItem[];
  rules: Rule[];
  craeteBy?: string;
  createAt?: Date;
}

export interface SerVerItem {
  serviceId: number;
  versionId: number;
  serviceName: string;
  versionName: string;
}

export interface AlertRuleListEntity {
  rows: AlertRuleEntity[];
  count: number;
}

export interface Rule {
  index: string;
  indexVal: string;
  threshold: number;
  duration: number;
}

export interface Index {
  v: string;
  l: string;
  hasValue: boolean;
}

export interface Operator {
  v: string;
  l: string;
}
