export interface PlatformEntity {
  name: string;
  type: string;
  desc: string;
  settled?: number;
  config?: PlatformConfig;
}

export interface PlatformConfig {
  fields: PlatformConfigItem[];
}

export interface PlatformConfigItem {
  key: string;
  required: boolean;
  def?: string;
  reg: string;
  name: string;
  desc: string;
  extra?: any;
  type?: any;
  projectCode?: string[];
}

export interface PlatformIntegrationListEntity {
  count: number;
  rows: PlatformItemEntity[];
}

export interface PlatformItemEntity {
  id: number;
  url: string;
  desc: string;
}
