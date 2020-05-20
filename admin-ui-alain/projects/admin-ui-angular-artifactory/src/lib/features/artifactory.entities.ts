export interface ArtifactoryEntity {
  id?: number;
  name: string;
  comment: string;
  deployParams?: any;
  runtimeParams?: any[];
  versions: ArtifactoryVersion[];
  updateAt?: Date;
}

export interface ArtifRuntimeParam {
  "type"?: string;
  "artifactoryId"?: number
  "key": string;
  "value": string;
  "comment": string;
}

export interface ArtifactoryVersion {
  id?: number;
  artifactoryId?: number;
  artifactoryName?: string;
  lastVersion: string;
  lastTime?: Date;
  flows?: StageFlow;
  updateAt?: Date;
}

export interface StageFlow {
  stages: StageFlowItem[];
  flowStatus?: string; // 正在运行 | 结束
  updateAt?: Date;
}

/**
 * PENDING: 当前stage未开始
 * TO_DEPLOY: 需要允许部署
 * TO_APPROVE: 需要批准stage
 * APPROVED: 已经审批，stage结束
 * REJECTED: 被拒绝，stage及后续stage结束
 */
export type STAGE_STATUS = 'PENDING' | 'TO_DEPLOY' | 'TO_APPROVE' | 'APPROVED' | 'REJECTED';

export interface StageFlowItem {
  id?: number;
  versionFlowInstanceId?: number;
  name: string;
  comment?: string;
  deployUrl?: string;
  deployToken?: string;
  stageStatus?: STAGE_STATUS;
  updateAt?: string;

  createByName?: string;

  confirmGroupId?: number | string;
  confirmGroupName?: string;
  confirmAt?: Date;
  confirmUserId?: string;
  confirmUsername?: string;
  confirmApproveReuslt?: string;

  deployAt?: Date;
  deployUserId?: string;
  deployUsername?: string;
  deployGroupId?: number | string;
  deployGroupName?: string;
  deployApproveResult?: string;

  rejectAt?: Date;
  rejectByName?: string;

  artifactoryVersionId?: number;
  iworkflowApproveTaskId?: string;
  iworkflowDefId?: string;
  iworkflowDeployTaskId?: string;
  iworkflowInstId?: string;
  nextStageId?: number;
  parentStageId?: string | any;
}
