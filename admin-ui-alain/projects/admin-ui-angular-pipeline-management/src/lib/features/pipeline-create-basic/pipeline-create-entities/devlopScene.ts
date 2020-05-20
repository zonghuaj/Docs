import { PipelineStage } from "./pipelineStage";

export interface DevlopScene {
    id?: number;
    name?: string;
    stages?: PipelineStage[];
}
