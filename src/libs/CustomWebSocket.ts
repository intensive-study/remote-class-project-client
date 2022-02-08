export class CustomWebSocket {

  private ws: WebSocket;
  private messageEvents: Map<string, Array<(message: any) => void>> = new Map<string, Array<(message: any) => void>>();
  private handleOpen?: () => void;
  private handleClose?: () => void;

  constructor(url: string) {
    this.ws = new WebSocket(url);
    this.ws.onopen = this.onOpen;
    this.ws.onclose = this.onClose;
    this.ws.onmessage = this.onMessage;
  }

  /**
   * 소켓 Open 이벤트 설정
   *
   * @param event
   */
  setOnOpen(event?: () => void) {
    this.handleOpen = event;
  }

  /**
   * 소켓 Close 이벤트 설정
   *
   * @param event
   */
  setOnClose(event?: () => void) {
    this.handleClose = event;
  }

  /**
   * 메세지 이벤트 추가
   *
   * @param type
   * @param event
   */
  addMessageEvent<T>(type: string, event: (message: T) => void) {
    if(!this.messageEvents.has(type)) {
      this.messageEvents.set(type, []);
    }
    this.messageEvents.get(type)?.push(event);
  }

  /**
   * 메세지 전송
   *
   * @param type 타입
   * @param data 보낼 데이터
   */
  public send(type: string, data: any) {
    data['type'] = type;
    const jsonData = JSON.stringify(data);
    this.ws.send(jsonData);
  }

  private onOpen() {
    this.handleOpen?.call(this);
  }

  private onClose() {
    this.handleClose?.call(this);
  }

  private onMessage(message: MessageEvent) {
    if (typeof message.data.type === 'undefined') {
      console.error('메세지 타입을 알 수 없습니다.');
    }
    const type: string = message.data.type;
    this.messageEvents.get(type.toLowerCase())?.forEach((event) => {
      event.call(this, message.data);
    });
  }

}