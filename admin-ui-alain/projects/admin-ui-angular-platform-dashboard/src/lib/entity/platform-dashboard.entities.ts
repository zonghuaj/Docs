
export interface PodsEntity {
  id?: number;
  name: string;
  labels: string[];
  isReady: boolean;
  cpuUsage: string;
  cpuLimit: string;
  memoryUsage: string;
  memoryLimit: string;
  createAt: Date;
}

export interface PodsListEntity {
  rows: PodsEntity[];
  count: number;
}
export interface ZGContainer {
  span: number;
  height: string;
  title: string;
  times?: Date[];
  step?: '';
  unit?: UnitParser;
  sources?: ZGSource[];
  text?: ZGText;
  chart?: ZGChart;
  _val?: any; // if this param set, the result will be ignored.
}


export interface ZGSource {
  qstring: string;
  step: string;
  opt?: ZGSourceOpt;
}

export interface ZGSourceOpt {
  alias?: string;
  color?: string;
}

export interface ZGText {
  type: 'avg' | 'max';
  text?: string;
  textColor?: string;
  textSize?: number;
  gauge?: any;
  bgChart?: any;
}

export interface ZGChart {
  useLegend?: boolean;
  fill?: boolean;
}

export interface ZGData {
  'metric'?: {
    'pod_name'?: string;
    'destination_workload'?: string;
    'instance'?: string;
  };
  opt?: ZGSourceOpt;
  values: any[];
}

export interface UnitParser {
  suffix?: string;
  decimal?: string; // use string here to check if defined
  parser: (val: any, decimal?: number, suffix?: string) => string;
}
