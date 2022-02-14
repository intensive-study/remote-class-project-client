import LectureSocket, {
  ResponseIceCandidate,
  ResponseLiveProceeding,
  ResponseSDP,
  ResponseUserEntered,
} from './LectureSocket';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const turnServers = [
  {
    urls: 'stun:stun.knowledgetalk.co.kr:46000',
  },
];
const stunServers = [
  {
    urls: 'turn:turn.knowledgetalk.co.kr:46000', username: 'kpoint', credential: 'kpoint01',
  },
];

interface Track {
  userId?: number;
  stream?: MediaStream;
}

interface Peer {
  type: 'lecturer' | 'student';
  connection: RTCPeerConnection;
}

interface LectureContextValue {
  userId: number;
  teacherId: number;
  peers: Map<number, Peer>;
  tracks: Map<number, Track>;
  isConnected: boolean;
  isLiveStarted: boolean;
  setUserId: Dispatch<SetStateAction<number>>;
  setPeers: Dispatch<SetStateAction<Map<number, Peer>>>;
  connect: () => void;
  startLive: () => void;
  enterLive: () => void;
  isLiveProceeding: () => void;
}

const emptyCallback = () => {
  // do Nothing
};

export const LectureContext = React.createContext<LectureContextValue>({
  userId: 1,
  peers: new Map<number, Peer>(),
  tracks: new Map<number, Track>(),
  teacherId: 1,
  isConnected: false,
  isLiveStarted: false,
  setUserId: emptyCallback,
  setPeers: emptyCallback,
  connect: emptyCallback,
  startLive: emptyCallback,
  enterLive: emptyCallback,
  isLiveProceeding: emptyCallback,
});

interface Props {
  children?: React.ReactNode;
}

export default function LectureProvider(props: Props) {
  const [socket, setSocket] = useState<LectureSocket>();
  const [stream, setStream] = useState<MediaStream>();
  const [userId, setUserId] = useState(1);
  const [teacherId, setTeacherId] = useState(1);
  const [lectureId] = useState(1);
  const [tracks, setTracks] = useState<Map<number, Track>>(new Map());
  const [peers, setPeers] = useState<Map<number, Peer>>(new Map());
  const [isConnected, setConnected] = useState(false);
  const [isLiveStarted, setLiveStarted] = useState(false);
  const navigate = useNavigate();

  const startLive = socket?.startLive || emptyCallback;
  const enterLive = socket?.enterLive || emptyCallback;
  const isLiveProceeding = socket?.isLiveProceeding || emptyCallback;

  useEffect(() => {
    if (socket && isConnected) {
      socket?.isLiveProceeding();
    }
  }, [socket, isConnected]);

  const onOpen = () => {
    setConnected(true);
  };

  const onClose = () => {
    setConnected(false);
  };

  const onStartLive = () => {
    //
  };

  const onLiveStarted = () => {
    setLiveStarted(true);
  };

  const onLiveProceeding = (message: ResponseLiveProceeding) => {
    if (message.status !== 200) {
      return;
    }

    if (message.proceeding) {
      socket?.enterLive();
    } else {
      socket?.enterWaitingRoom();
    }
  };

  const onIceCandidate = (e: RTCPeerConnectionIceEvent) => {
    if (!e.candidate) {
      return;
    }
    socket?.candidate(e.candidate);
  };

  const onReceiveIceCandidate = (e: ResponseIceCandidate) => {
    if (!e.userId || !peers.has(e.userId)) {
      return;
    }

    const peer = peers.get(e.userId);
    peer?.connection.addIceCandidate(e.candidate)
      .then();
  };

  const onUserEntered = (message: ResponseUserEntered) => {
    if (!message.userId || peers.has(message.userId)) {
      return;
    }

    const peer = new RTCPeerConnection({ iceServers: [...stunServers, ...turnServers] });

    peers.set(message.userId, {
      type: 'student',
      connection: peer,
    });

    peer.addEventListener('icecandidate', onIceCandidate);
    peer.addEventListener('track', (e) => {
      console.log('ontrack', e);
      if (e.streams.length === 0) {
        return;
      }
      const stream = e.streams[0];
      const newTracks = new Map(tracks);
      if (!newTracks.has(message.userId)) {
        newTracks.set(message.userId, {});
      }

      const track = newTracks.get(message.userId);
      if (track) {
        track.stream = stream;
        track.userId = message.userId;
      }

      setTracks(() => newTracks);
    });

    stream?.getTracks().forEach((track) => {
      peer.addTrack(track, stream);
    });

    peer.createOffer()
      .then((sdp) => {
        peer.setLocalDescription(sdp)
          .then(() => {
            socket?.sdp(sdp);
          });
      });
  };

  const onSdpAnswer = (message: ResponseSDP) => {
    if (!message.userId || !peers.has(message.userId)) {
      return;
    }

    const peer = peers.get(message.userId);
    peer?.connection.setRemoteDescription(message.sdp)
      .then();
  };

  const onSdpOffer = (message: ResponseSDP) => {
    if (!message.userId || peers.has(message.userId)) {
      return;
    }

    const peer = new RTCPeerConnection({ iceServers: [...stunServers, ...turnServers] });

    peers.set(message.userId, {
      type: 'student',
      connection: peer,
    });

    peer.addEventListener('icecandidate', onIceCandidate);
    peer.addEventListener('track', (e) => {
      console.log('ontrack', e);
      if (e.streams.length === 0) {
        return;
      }
      const stream = e.streams[0];
      const newTracks = new Map(tracks);
      if (!newTracks.has(message.userId)) {
        newTracks.set(message.userId, {});
      }

      const track = newTracks.get(message.userId);
      if (track) {
        track.stream = stream;
        track.userId = message.userId;
      }

      setTracks(() => newTracks);
    });

    stream?.getTracks().forEach((track) => {
      peer.addTrack(track, stream);
    });

    peer.setRemoteDescription(message.sdp)
      .then(() => {
        peer.createAnswer()
          .then((sdp) => {
            peer.setLocalDescription(sdp)
              .then(() => {
                socket?.sdp(sdp);
              });
          });
      });
  };

  const onSdp = (message: ResponseSDP) => {
    if (!message.sdp) {
      return;
    }

    if (message.sdp.type === 'offer') {
      onSdpOffer(message);
    } else if (message.sdp.type === 'answer') {
      onSdpAnswer(message);
    }
  };

  // 소켓 서버 연결
  const connect = () => {
    // 카메라 마이크 권한 요청
    navigator.mediaDevices.getUserMedia({
      audio: true, video: true,
    }).then((stream) => {
      // 권한 획득에 성공하면 소켓 연결
      const socket = new LectureSocket(
        'ws://localhost:8888',
        userId,
        lectureId,
        onOpen,
        onClose);

      socket.setOnMessage(console.log);
      const newTracks = new Map(tracks);
      newTracks.set(userId, {
        userId: userId,
        stream: stream,
      });

      setSocket(() => {
        setStream(() => {
          setTracks(() => newTracks);
          return stream;
        });
        return socket;
      });

    }).catch((e) => {
      alert(e.message);
      navigate('/');
    });
  };

  // 이벤트 설정
  useEffect(() => {
    socket?.addMessageEvent('startLive', onStartLive);
    socket?.addMessageEvent('liveStarted', onLiveStarted);
    socket?.addMessageEvent('isLiveProceeding', onLiveProceeding);
    socket?.addMessageEvent('userEntered', onUserEntered);
    socket?.addMessageEvent('sdp', onSdp);
    socket?.addMessageEvent('IceCandidate', onReceiveIceCandidate);
  }, [socket]);

  return (
    <LectureContext.Provider value={{
      userId,
      teacherId,
      peers,
      tracks,
      isConnected,
      isLiveStarted,
      setPeers,
      setUserId,
      isLiveProceeding,
      connect,
      startLive,
      enterLive,
    }}>
      {props.children}
    </LectureContext.Provider>
  );
}
