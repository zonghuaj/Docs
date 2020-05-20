import { InstanceDef } from './instanceDef';


/**
 * 阶段提交信息
 */
export interface PipelineStage { 
    title?: string;
    /**
     * 用于描述当前阶段的类型
     */
    //type?: PipelineStage.TypeEnum;
    type?: string;
    instance?: InstanceDef;
}
// export namespace PipelineStage {
//     export type TypeEnum = 'CodeSource' | 'CodeCheck' | 'UnitTest' | 'CodeBuild' | 'DockerBuild' | 'Publish';
//     export const TypeEnum = {
//         CodeSource: 'CodeSource' as TypeEnum,
//         CodeCheck: 'CodeCheck' as TypeEnum,
//         UnitTest: 'UnitTest' as TypeEnum,
//         CodeBuild: 'CodeBuild' as TypeEnum,
//         DockerBuild: 'DockerBuild' as TypeEnum,
//         Publish: 'Publish' as TypeEnum
//     };
// }


