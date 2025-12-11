import { fx } from "../../core/system/System";
import { NodeType } from "../../core/types/NodeType";
import { EventManager as Eve } from "../../core/events/EventManager";
import { getCatchValue } from "../../utils/index";
import { OperationLayerData } from "./OperationLayerData";
import { MetadataData } from "../metadata/MetadataData";
import { VariableValue } from "../models/VariableValue";

/**
 * 元数据列表项的类型定义
 * @interface MetadataListItem
 */
interface MetadataListItem {
    /** 数值 */
    value: number;
    /** 名称 */
    name: string;
}

/**
 * 广告牌图层类，用于管理广告牌相关的运算层和元数据
 * @class BillboardLayer
 */
export class BillboardLayer {
    /** 图层名称 */
    name: string = "";
    /** 运算层数组 */
    operationArray: OperationLayerData[] = [];
    /** 元数据数组 */
    metadataArray: MetadataData[] = [];
    /** 唯一标识符 */
    id: number = 0;

    /** 是否被监控 */
    monitored: boolean = true;
    /** 构造函数名称 */
    constructorName: string = "BillboardLayer";

    /**
     * 创建广告牌图层实例
     * @param name - 图层名称
     */
    constructor(name: string) {
        this.name = name;
        this.id = ++Eve.IDINDEX;
    }

    /**
     * 释放资源，清理图层数据
     */
    dispose(): void {
        this.name = null as any;
        this.operationArray = null as any;
        this.metadataArray = null as any;
        this.monitored = null as any;
    }

    /**
     * 填充运算层数据
     * 从当前点击的运算层对象中获取数据并添加到运算层数组中
     */
    pushOperationLayer(): void {
        if (
            fx.clickBody != null &&
            fx.clickBody.type == NodeType.CalculationLayer 
        ) {
            const operationLayerData = new fx.OperationLayerData(fx.clickBody);

            this.operationArray.push(operationLayerData);
        }
        fx.clickBody = null;
    }

    /**
     * 添加元数据
     * 从当前点击的变量值对象中创建元数据并添加到元数据数组中
     * @param type - 元数据类型
     * @param minValue - 最小值
     * @param maxValue - 最大值
     * @param intervalValue - 间隔值
     * @param list - 可选的元数据列表项数组
     */
    pushMetadata(type: number, minValue: number, maxValue: number, intervalValue: number, list?: MetadataListItem[]): void {
        if (fx.clickBody != null) {
            if (fx.clickBody instanceof fx.VariableValue)
                if (fx.clickBody.type != 5) {
                    const metadataData = new fx.MetadataData(fx.clickBody);
                    metadataData.type = type;
                    metadataData.presentValue = getCatchValue(metadataData.body);
                    metadataData.minValue = minValue;
                    metadataData.maxValue = maxValue;
                    metadataData.intervalValue = intervalValue;
                    metadataData.list =
                        list && list.length
                            ? list.map((item: MetadataListItem) => ({
                                value: Number(item.value),
                                name: item.name,
                            }))
                            : [];

                    this.metadataArray.push(metadataData);
                }
        }
        fx.clickBody = null;
    }
}
