export interface PipelineTemplateInfo {
  name: string; // 模板名称
  description: string; // 描述
  isGenerateImage: string; // 是否构建镜像
  imageTemplateId: string; // 镜像模板
  // isDeploy: string; // 是否发布服务
  script?: string; // JenkinsFile全代码
  params: PipelineTemplateParam[]; // 自定义参数
}

export interface PipelineTemplateParam {
  key: string; // 参数名
  label: string; // 中文名
  defValue: string; // 默认值
  promptMessage: string; // 描述
}

export interface PipelineStage {
  name: string;
}

export interface PConstants {
  name?: string;
  key?: string;
  desc?: string;
}

export const PIPELINE_TEMPLATE_CONSTANTS: PConstants[] = [
  {key: 'pipeline_name', name: '流水线名称', desc: '在创建流水线时输入'},
  {key: 'src_git_url', name: 'Git代码地址', desc: '在创建流水线时输入，也可以直接选择代码工程中记录的地址。'},
  {key: 'src_git_branch', name: 'Git分支', desc: '在创建流水线时输入，用户输入Git地址后，如果地址合法，会自动从对应地址上拉取。'},
  {key: 'tenant_name', name: '租户名', desc: 'MicroPaaS平台当前登录用户对应的租户名称。'},
  {key: 'project_name', name: '项目名', desc: 'MicroPaaS平台当前登录用户对应的项目名称。'},
  {key: 'service_name', name: '服务名', desc: 'MicroPaaS平台当前登录用户对应的服务。'},
  {key: 'service_version', name: '服务版本号', desc: 'MicroPaaS平台当前登录用户对应的服务版本号。'},
];
