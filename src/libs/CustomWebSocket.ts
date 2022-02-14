export interface ResponseBase {
  status: number;
}

export interface MessageBase {
  type: string;
  userId: number;
  lectureId: number;
}

export default class CustomWebSocket {

  private ws: WebSocket;
  private messageEvents: Map<string, Array<(message: any | MessageBase) => void>> = new Map<string, Array<(message: any | MessageBase) => void>>();
  private handleMessage?: (message: any | MessageBase) => void;
  private handleSend?: (message: any | MessageBase) => void;

  constructor(
    url: string,
    handleOpen?: (this: WebSocket, ev: Event) => any,
    handleClose?: (this: WebSocket, ev: CloseEvent) => any,
  ) {
    this.ws = new WebSocket(url);
    this.ws.onopen = handleOpen || null;
    this.ws.onclose = handleClose || null;
    this.ws.onmessage = this.onMessage.bind(this);
  }

  close = () => {
    this.ws.close();
  };

  /**
   * 메세지 이벤트 추가
   *
   * @param type
   * @param event
   */
  addMessageEvent = (type: string, event: (message: any) => void) => {
    if (!this.messageEvents.has(type)) {
      this.messageEvents.set(type.toLowerCase(), []);
    }
    this.messageEvents.get(type.toLowerCase())?.push(event);
  };

  setOnMessage = (
    handleMessage: (ev: any | MessageBase) => any,
  ) => {
    this.handleMessage = handleMessage;
  };

  setOnSend = (
    handleSend: (ev: any | MessageBase) => any,
  ) => {
    this.handleSend = handleSend;
  };

  /**
   * 메세지 전송
   *
   * @param type 타입
   * @param data 보낼 데이터
   */
  send = (type: string, data: any) => {
    data['type'] = type;
    const jsonData = JSON.stringify(data);
    this.handleSend?.call(this, data);
    console.log(jsonData);
    this.ws.send(jsonData);
  };

  onMessage = (message: MessageEvent) => {
    const data = typeof message.data === 'string' ? JSON.parse(message.data) : message.data;

    this.handleMessage?.call(this, data);
    if (typeof data.type === 'undefined') {
      console.error('메세지 타입을 알 수 없습니다.');
      return;
    }
    const type: string = data.type;
    this.messageEvents.get(type.toLowerCase())?.forEach((event) => {
      event.call(this, data);
    });
  };

}