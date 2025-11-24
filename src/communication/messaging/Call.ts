

import { MessageList } from "./MessageList";

/**
 * 调用类，用于发送消息和触发事件
 * 提供静态方法来发送消息到消息列表中的所有监听器
 */
export class Call {
  /**
   * 构造函数
   */
  constructor() { }

  /**
   * 发送消息到所有注册的事件监听器
   * @param type - 事件类型标识符
   * @param message - 要发送的消息对象，如果为null则不会发送
   * @param fun - 可选的回调函数，当消息被处理后会调用此函数
   */
  static send(
    type: string,
    message: any,
    fun?: ((type: string, value: any) => void) | null
  ): void {
    if (message != null) {
      message.Call_Event_type = type;
    }
    for (
      let i = 0;
      i < MessageList.getInstance().eventMessageList.length;
      i++
    ) {
      if (MessageList.getInstance().eventMessageList[i].getEvents(type)) {
        const value = MessageList.getInstance().eventMessageList[
          i
        ].execute(type, message);
        if (fun) {
          fun.apply([type], [value] as any);
        }
      }
    }
  }
}
