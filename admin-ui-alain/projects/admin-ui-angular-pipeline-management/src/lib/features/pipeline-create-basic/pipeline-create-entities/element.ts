import { ElementSelectOption } from './elementSelectOption';

export interface Element {
    /**
     * 字段显示的序号
     */
    index?: number;
    /**
     * 字段的key
     */
    name?: string;
    /**
     * 字段显示的Label
     */
    label?: string;
    /**
     * 字段的数据类型 ： input ： 字符串 select：下拉列表 selectFromUrl： 下拉列表从url读取  switch 开关 textarea 多行文本  command：命令
     */
    type?: Element.TypeEnum;
    /**
     * 是否必填
     */
    required?: boolean;
    /**
     * 提示信息
     */
    placeholder?: string;
    /**
     * 默认值
     */
    _default?: string;
    /**
     * 如果是selectFromUrl类型的数据，此字段用于描述下拉列表框的选择项来源
     */
    dataSourceUri?: string;
    /**
     * 如果type的值为select,此字段包含所有可以选择的项
     */
    dataOptions?: ElementSelectOption[];
}
export namespace Element {
    export type TypeEnum = 'input' | 'select' | 'selectFromUrl：' | 'switch' | 'textarea' | 'command';
    export const TypeEnum = {
        Input: 'input' as TypeEnum,
        Select: 'select' as TypeEnum,
        SelectFromUrl: 'selectFromUrl：' as TypeEnum,
        Switch: 'switch' as TypeEnum,
        Textarea: 'textarea' as TypeEnum,
        Command: 'command' as TypeEnum,
    };
}
