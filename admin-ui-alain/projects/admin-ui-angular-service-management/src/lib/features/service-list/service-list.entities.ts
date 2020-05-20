import {ServiceEntity, VersionEntity} from "admin-ui-angular-common";

export interface ServiceListEntity {
  count: number;
  rows: ServiceEntity[];
}

export interface VersionListEntity {
  count: number;
  rows: VersionEntity[];
}

export interface RollbackHis {
  revision: string;
  updated: string;
  status: string;
  chart?: string;
  description: string;
}

/**
 * get status of versions
 */
export interface VersionStatus {
  id: number;
  status: number;
  podNum: number;
  podInfo: PodDetail[];
}

export class PodDetail {
  constructor(name: string, status: string, message: string) {
    this.name = name;
    this.status = status;
    this.message = message;
  }

  name: string;
  status: string;
  message: string;
}

