import CustomWebSocket, { MessageBase } from './CustomWebSocket';

type StartLive = MessageBase;

type EnterLive = MessageBase;

export interface SDP {
  sdp: string;
  type: 'offer' | 'answer';
}

export interface SdpOffer extends MessageBase {
  sdp: SDP;
}

export type SdpAnswer = MessageBase

export type ExitLive = MessageBase

export default class LectureSocket extends CustomWebSocket {

  private readonly userId: number;
  private readonly lectureId: number;

  constructor(
    url: string,
    userId: number,
    lectureId: number,
    handleOpen?: (this: WebSocket, ev: Event) => any,
    handleClose?: (this: WebSocket, ev: CloseEvent) => any,
  ) {
    super(url, handleOpen, handleClose);
    this.userId = userId;
    this.lectureId = lectureId;
  }

  startLive() {
    this.send('startLive', {
      userId: this.userId,
      lectureId: this.lectureId,
    });
  }

  enterLive() {
    this.send('enterLive', {
      userId: this.userId,
      lectureId: this.lectureId,
    });
  }

  sdpOffer(sdp: SDP) {
    this.send('sdpOffer', {
      userId: this.userId,
      lectureId: this.lectureId,
      sdp: sdp,
    });
  }

  sdpAnswer(sdp: SDP) {
    this.send('sdpAnswer', {
      userId: this.userId,
      lectureId: this.lectureId,
      sdp: sdp,
    });
  }

  exitLive() {
    this.send('exitLive', {
      userId: this.userId,
      lectureId: this.lectureId,
    });
  }
}