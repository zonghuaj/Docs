export interface ServiceListEntity {
  count: number;
  rows: ServiceEntity[];
}

export interface VersionListEntity {
  count: number;
  rows: VersionEntity[];
}

export interface ServPort {
  protocol: string;
  port: number;
}

export interface ServiceEntity {
  id?: number;
  tenantCode?: string;
  projectCode?: string; // 项目code
  serviceName: string; // 服务名称
  serviceDesc: string; // 服务描述
  routerHost: string; // 服务路由
  routerPrefix: string; //  服务前缀
  appPorts: ServPort[]; // 服务端口列表
  gateway?: string;
  createBy?: string; // 创建人
  createDate?: string; // 创建时间
  lastModifiedBy?: string; // 修改人
  lastModifiedDate?: string; // 修改时间
  versions?: VersionEntity[];
}


export interface VersionEntity {
  id: number;
  versionDesc: string;
  tenantCode?: string;
  projectCode?: string;
  serviceId: number; // 服务ID
  service_id?: number; // fuck anyi
  gitUrl: string; // git地址
  gitBrunch: string; // git分支
  operatingEnv: string; // 运行环境
  replica: number; // 实例数
  jvmArgs: string; // jvm参数
  appArgs: string; // 应用参数
  buildType: string; // 构建类型
  status: number; // 当前状态
  targetFile: string; // 目标文件
  packagePath: string; // 打包路径
  podStatus: string; // 节点状态
  sourceType: number; // 来源类型
  imageAddr: string; // 镜像地址
  imageTag: string; // 镜像标签
  version: string; // 版本
  cpuLimit: number; // cpu限制
  memoryLimit: number; // 内存限制
  env: string; // 环境变量
  dependencies: string; // 调用服务
  mountPath: string; // 挂载路径
  mountType: string; // 读写类型
  mountLimit: number; // 挂载限额
  createBy: string; // 创建人
  createDate?: string; // 创建时间
  lastModifiedBy: string; // 修改人
  lastModifiedDate?: string; // 修改时间
  configInfo?: string; // 配置文件列表
  autoscale?: any; // 水平伸缩
  podDetail?: PodDetail[];
  jenkinsId: number; // jenkinsId
  imageTemplateParam: string; // 镜像模板参数
  pipelineTemplateId?: number; // 流水线模板id
  pipelineParams?: any[]; // jenkins模板参数
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
