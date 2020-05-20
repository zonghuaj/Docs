import {QGateProject} from './quality-gate.entities';

export interface QualityGateRule {
  id?: string;
  name: string;
  conditions?: SavedRule[];
  projects?: QGateProject[];
}

export interface SavedRule {
  id: string;
  metric: string;
  op: string;
  error: string;
}

export interface RuleMetric {
  custom: boolean;
  description: string;
  direction: number;
  domain: string;
  hidden: boolean;
  id: number;
  key: string;
  name: string;
  qualitative: boolean;
  type: string;
  value?: string; // from user input
  op?: string; // from user input
}
