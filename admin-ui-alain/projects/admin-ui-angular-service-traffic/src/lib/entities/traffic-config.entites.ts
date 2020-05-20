export interface GatewayConfigEntity {
  id: number;
  name: string;
  description?: string;
  domains?: string;
  port?: number;
  enable?: boolean;
  tenantCode?: string;
  projectCode?: string;
  createBy?: string;
  createDate?: Date;
  lastModifiedBy?: string;
  lastModifiedDate?: Date;
}

export interface ServiceConfigEntity {
  id: number;
  appPorts: number;
  name: string; // 名称
  serviceName: string;
  gateway: string; // 网关
  description: string; // 描述
  domains: string; // 域名
  prefix: string; // 路径
  crossOrigin: CorsEntity | string;
  gray: string | any;
  match: string | any;
  tenantCode: string;
  projectCode: string;
  createBy: string;
  createDate: Date;
  lastModifiedBy: string;
  lastModifiedDate: Date;
}

export interface CorsEntity {
  enable: boolean;
  source: string;
  header: string;
  method: string;
  expired: string;
}

export interface RouteConfigEntity {
  vname: string;
  matches: RouteMatchEntity[];
}

export interface RouteMatchEntity {
  matchKey: string;
  matchHeader: string;
  matchType: string;
  matchVal: string;
}


export interface VersionTrafficConfigEntity {
  id?: number;
  name: string;
  protectEnable: boolean;
  monitorEnable: boolean;
  minAvailableNum: number | string;
  overtime: number | string;
  errorTimes: number | string;
  maxConcurrent: number | string;
  monitorInterval: number | string;
  tenantCode?: string;
  projectCode?: string;
  createBy?: string;
  createDate?: Date;
  lastModifiedBy?: string;
  lastModifiedDate?: Date;
}
