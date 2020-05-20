export interface QGateProject {
  id?: string;
  key?: string;
  name: string;
  analysisDate: string;

  qualityGate?: QualityGate;
}

export interface QualityGate {
  key?: string;
  name: string;
}

export interface IndexMetric {
  _metric?: any; // original measure metric config
  metric: string;
  name?: string;
  rating?: string;
  value: string;
}
