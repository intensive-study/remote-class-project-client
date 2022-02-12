import LectureSocket from './LectureSocket';

const turnServers = [];
const stunServers = [];

export default class LectureClient {

  socket?: LectureSocket;

  isConnected = false;

  constructor(userId: number, lectureId: number) {
    this.socket = new LectureSocket(
      'ws://localhost:8888',
      userId,
      lectureId,
      this.onOpen,
      this.onClose);
  }


  /**
   * 필요한 권한 요청
   * 카메라 및 마이크
   *
   */
  requestRequiredPermission() {
    return navigator.mediaDevices.getUserMedia({
      audio: true, video: true,
    });
  }

  private onOpen() {
    this.isConnected = true;
  }

  private onClose() {
    this.isConnected = false;
  }

}