import { InstanceDef } from './instanceDef';

/**
 * 当前系统可用构建类型列表
 */
export interface StageDef {
    title?: string;
    /**
     * 用于描述当前阶段的类型
     */
    type?: StageDef.TypeEnum;
    instances?: InstanceDef[];
}
export namespace StageDef {
    export type TypeEnum = 'CodeSource' | 'CodeCheck' | 'UnitTest' | 'CodeBuild' | 'DockerBuild' | 'Publish';
    export const TypeEnum = {
        CodeSource: 'CodeSource' as TypeEnum,
        CodeCheck: 'CodeCheck' as TypeEnum,
        UnitTest: 'UnitTest' as TypeEnum,
        CodeBuild: 'CodeBuild' as TypeEnum,
        DockerBuild: 'DockerBuild' as TypeEnum,
        Publish: 'Publish' as TypeEnum,
    };
}
