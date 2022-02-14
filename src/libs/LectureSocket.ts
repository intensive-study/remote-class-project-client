import CustomWebSocket, { MessageBase, ResponseBase } from './CustomWebSocket';

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

export interface ResponseLiveProceeding extends ResponseBase {
  proceeding?: boolean;
}

export interface ResponseUserEntered extends ResponseBase {
  userId: number;
}

export interface ResponseSDP extends ResponseBase {
  userId: number;
  sdp: RTCSessionDescriptionInit;
}

export interface ResponseIceCandidate extends ResponseBase {
  userId: number;
  candidate: RTCIceCandidate;
}


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

  startLive = () => {
    this.send('startLive', {
      userId: this.userId,
      lectureId: this.lectureId,
    });
  };

  isLiveProceeding = () => {
    this.send('isLiveProceeding', {
      userId: this.userId,
      lectureId: this.lectureId,
    });
  };

  enterWaitingRoom = () => {
    this.send('enterWaitingRoom', {
      userId: this.userId,
      lectureId: this.lectureId,
    });
  };

  enterLive = () => {
    this.send('enterLive', {
      userId: this.userId,
      lectureId: this.lectureId,
    });
  };

  sdp = (sdp: RTCSessionDescriptionInit) => {
    this.send('sdp', {
      userId: this.userId,
      lectureId: this.lectureId,
      sdp: sdp,
    });
  };

  candidate = (candidate: RTCIceCandidate) => {
    this.send('IceCandidate', {
      userId: this.userId,
      lectureId: this.lectureId,
      candidate: candidate,
    });
  };

  exitLive = () => {
    this.send('exitLive', {
      userId: this.userId,
      lectureId: this.lectureId,
    });
  };

}