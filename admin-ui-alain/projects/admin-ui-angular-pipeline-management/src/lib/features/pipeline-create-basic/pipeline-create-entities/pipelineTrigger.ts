import { triggerElement } from './element_trigger';

export interface PipelineTrigger { 
    /**
     * 触发方式： 无  / 固定时间  /代码Git仓库时间出发
     */
    type?: string;
    /**
     * 具体出发条件的表达式，json形式数据，不同类型，数据字段不同
     */
    express?: triggerElement;
}

