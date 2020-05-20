import { PipelineTrigger } from './pipelineTrigger';
import { PipelineStage } from './pipelineStage';

export interface Pipeline {
    /**
     * 保存接口不需要提供
     */
    id?: number;
    name?: string;
    jenkins?: string;
    stages?: PipelineStage[];
    trigger?: PipelineTrigger;
}
