export interface Log {
  timestamp: string;
  content: string;
  time?: Date;
}

export interface Replicas {
  containerNames: string[];
  podNames: string[];
}