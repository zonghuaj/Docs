export interface PMonitorListEntity {
  rows: PMonitorEntity[];
  count: number;
}

export interface PMonitorEntity {
  projectCode: string;
  cpuTotal: number;
  cpuUsage: number;
  cpuMaxRate: number;
  memoryTotal: number;
  memoryUsage: number;
  memoryMaxRate: number;
}
