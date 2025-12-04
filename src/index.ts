import { fx } from "./core/system/System";

export { fx };
export { FXCentre } from "./game/combat/FXCentre";
export { FXCentre as SeerCentre } from "./game/combat/FXCentre";
export { Folder } from "./data/storage/Folder";
export { EventManager as Eve } from "./core/events/EventManager";
export { CallCenter } from "./communication/messaging/CallCenter";
export { MessageList } from "./communication/messaging/MessageList";
export { VariableValue } from "./data/models/VariableValue";
export { Call } from "./communication/messaging/Call";
export { SymbolBody } from "./data/models/SymbolBody";
export { BasicBody } from "./data/models/BasicBody";
export { OperationBody } from "./data/models/OperationBody";
export { Player } from "./game/combat/Player";
export { BillboardLayer } from "./data/layers/BillboardLayer";
export { ChartsLayer } from "./data/layers/ChartsLayer";
export { Bookmark } from "./data/metadata/Bookmark";
export { FormulaData } from "./data/metadata/FormulaData";
export { MetadataData } from "./data/metadata/MetadataData";
export { OperationLayerData } from "./data/layers/OperationLayerData";
export { Message } from "./communication/messaging/Message";
export { NodeType } from "./core/types/NodeType";
export { MathUtils } from "./utils/MathUtils";

// 环境兼容性处理
const globalThis_: any = (function () {
    if (typeof globalThis !== 'undefined') return globalThis;
    if (typeof window !== 'undefined') return window;
    // @ts-ignore
    if (typeof global !== 'undefined') return global;
    if (typeof self !== 'undefined') return self;
    return {};
})();

globalThis_.fx = fx;
globalThis_.seer = fx;
