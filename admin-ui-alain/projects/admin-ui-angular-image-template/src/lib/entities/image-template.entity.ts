export interface ImageTemplateList {
  rows: ImageTemplate[];
  count: number;
}

export interface ImageTemplate {
  isSystem?: boolean;
  id?: number;
  name?: string;
  description?: string;
  script?: string;
  params?: ImageTemplateParam[];
}

export interface ImageTemplateParam {
  id?: number;
  key: string; // 参数名
  label: string; // 中文名
  defValue: string; // 默认值
  promptMessage: string; // 描述
}
