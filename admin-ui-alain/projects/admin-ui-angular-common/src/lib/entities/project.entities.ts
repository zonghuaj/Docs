export interface ProjectEntity {
  projectId?: number;
  projectCode: string;
  projectName: string;
  projectDesc: string;

  cpuLimit: number;
  cpuUsed?: number;
  memoryLimit: number;
  memoryUsed: number;
  storageLimit?: number;

  dockerRegistry: string;
  dockerUsername: string;
  dockerPassword: string;

  skywalkingCpu: number;
  skywalkingMemory: number;
  esAddress: string;
  esShards: number;
  esReplicas: number;

  tenantCode: string;
  createBy: string;
  createDate: Date;
  lastModifiedBy: string;
  lastModifiedDate: Date;
}

export interface ProjectListEntity {
  count: number;
  rows: ProjectEntity[];
}
