export interface DockerfileListEntity {
  count: number;
  rows: DockerfileEntity[];
}

export interface ProjectListEntity {
  count: number;
  rows: ProjectEntity[];
}

export interface PipelineListEntity {
  count: number;
  rows: PipelineEntity[];
}

export class JenkinsPipelineListEntity {
  count: number;
  rows: JenkinsPipelineEntity[];
}

export class ProjectTypesListEntity {
  count: number;
  rows: ProjectTypeEntity[];
}


export class JenkinsfileListEntity {
  count: number;
  rows: JenkinsfileEntity[];
}



export class JenkinsConfigListEntity {
  count: number;
  rows: JenkinsConfigEntity[];
}

export class DockerfileEntity {
  "dockerfileId"?: number;
  "projectCode"?: string; // 项目code
  "projectType": string; // 工程类型
  "content": string; // dokcerfile模板内容
  "tenantCode": string; // 租户code
  "createDate": string; //创建时间
  "createBy": string;  // 创建者
  "updateDate": string;  // 更新时间
  "updateBy": string;  //更新者
}

export class JenkinsfileEntity {
  "deploymentId"?: number;
  "projectCode"?: string; // 项目code
  "projectType": string; // 工程类型
  "content": string; // dokcerfile模板内容
  "tenantCode": string; // 租户code
  "createDate": string; //创建时间
  "createBy": string;  // 创建者
  "updateDate": string;  // 更新时间
  "updateBy": string;  //更新者
}

export class JenkinsPipelineEntity {
  "jenkinsPipelineId"?: number;
  "projectCode"?: string; // 项目code
  "projectType": string; // 工程类型
  "content": string; // dokcerfile模板内容
  "tenantCode": string; // 租户code
  "createDate": string; //创建时间
  "createBy": string;  // 创建者
  "updateDate": string;  // 更新时间
  "updateBy": string;  //更新者
}

export class ProjectTypeEntity {
  "id"?: number;
  "projectCode"?: string; // 项目code
  "projectType": string; // 工程类型
  "tenantCode": string; // 租户code
  "createDate": string; //创建时间
  "createBy": string;  // 创建者
  "updateDate": string;  // 更新时间
  "updateBy": string;  //更新者
}

export class JenkinsConfigEntity {
  "jenkinsConfigId"?: number;
  "projectCode"?: string; // 项目code
  "jenkinsUrl": string; // 工程类型
  "jenkinsToken": string; // dokcerfile模板内容
  "tenantCode": string; // 租户code
  "createDate": string; //创建时间
  "createBy": string;  // 创建者
  "updateDate": string;  // 更新时间
  "updateBy": string;  //更新者
}


export class ProjectEntity {
  "projectId"?: number;
  "projectCode"?: string; // 项目code
  "projectName": string; // 项目名称
  "projectDesc": string; // 项目描述
  "tenantCode": string; // 租户code
  "createDate": string; //创建时间
  "createBy": string;  // 创建者
  "updateDate": string;  // 更新时间
  "updateBy": string;  //更新者
}

export class PipelineEntity {
  "id"?: number;
  "name"?: string; // 项目code
  "tenantCode": string; // 项目名称
  "projectCode": string; // 项目描述
  "pipelineTemplateId": string; // 租户code
  "script": string; // 租户code
  "srcGitUrl": string; // 租户code
  "srcGitBrunch": string; // 租户code
  "isAutoTrigger": string; // 租户code
  "autoTriggerEvent": string; // 租户code
  "status": string; // 租户code
  "lastVersion": string; // 租户code
  "createAt": string; //创建时间
  "createBy": string;  // 创建者
  "updateAt": string;  // 更新时间
  "updateBy": string;  //更新者
}

export class PipelineEditEntity {
  'id'?: number;
}
