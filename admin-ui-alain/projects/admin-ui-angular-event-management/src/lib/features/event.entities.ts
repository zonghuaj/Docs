export interface EventEntity {
  "id"?: number;
  "type"?: string; // 通知类型： 通知、告警、留言
  "from"?: string; // 通知来源
  "to": string[]; // 发送给那些用户
  "toGroup": string; // 发送到组
  "createAt": string; // 创建时间
  "readAt": string; //  阅读时间
  "read": boolean; // 是否已读
  "message"?: string; // 通知信息
}

export interface EventListEntity {
  "count": number;
  "rows": EventEntity[];
}

export enum EventType {
  alert = "通知"
}


