export interface PipelineStageInstance { 
    /**
     * 此stage选中的阶段定义ID  InstanceDef class 中的ID
     */
    defId?: string;
    /**
     * 次阶段自定义名称
     */
    name?: string;
    /**
     * 此处数据结构为动态结构，与类型有关，根据类型不同有不同的数据字段
     */
    form?: object;
}
