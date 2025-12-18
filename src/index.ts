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
export {
  Logger,
  LogLevel,
  LogEntry,
  LoggerConfig,
  LogTransport,
  ConsoleTransport,
  MemoryTransport,
  CallbackTransport,
  createLogger,
  configureLogger,
  setLogLevel,
  setModuleLogLevel,
  getLogBuffer,
} from "./utils/Logger";

/**
 * 环境兼容性处理：支持多种 JavaScript 运行环境
 * 
 * @remarks
 * This function provides cross-environment compatibility by checking for
 * global objects in the following order:
 * 1. globalThis (ES2020 standard, available in modern environments)
 * 2. window (browser environment)
 * 3. global (Node.js environment - requires type assertion due to potential absence in browser)
 * 4. self (Web Worker environment)
 * 5. Empty object (fallback)
 * 
 * Type assertion is used for 'global' because it may not exist in browser environments.
 * This is intentional for Node.js compatibility and is safe due to the typeof check.
 * 
 * @returns The appropriate global object for the current environment
 */
const globalThis_: Record<string, unknown> = (function (): Record<string, unknown> {
    if (typeof globalThis !== 'undefined') return globalThis as unknown as Record<string, unknown>;
    if (typeof window !== 'undefined') return window as unknown as Record<string, unknown>;
    // Type assertion: 'global' may not exist in browser environments
    // This is intentional for Node.js compatibility
    // Accessing 'global' via bracket notation to avoid TypeScript error
    // We use 'unknown' as an intermediate type to safely convert to Record<string, unknown>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const nodeGlobal = (globalThis as any)['global'] as Record<string, unknown> | undefined;
    if (typeof nodeGlobal !== 'undefined') return nodeGlobal;
    if (typeof self !== 'undefined') return self as unknown as Record<string, unknown>;
    return {};
})();

globalThis_.fx = fx;
globalThis_.seer = fx;
