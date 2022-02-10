import { Button, TextField } from '@mui/material';
import React, { useState } from 'react';
import LectureSocket from '../../../libs/LectureSocket';

interface Message {
  type: 'info' | 'send' | 'receive';
  message: string;
}

export default function Test() {
  const [address, setAddress] = useState('ws://localhost:8888');
  const [messages, setMessages] = useState<Array<Message>>([]);
  const [lectureSocket, setLectureSocket] = useState<LectureSocket>();

  const printLog = (message: Message) => {
    console.log(`[${message.type}]: ${message.message}`);
    setMessages((messages) => [
      ...messages,
      message,
    ]);
  };

  const handleConnect = () => {
    lectureSocket?.close();
    const socket = new LectureSocket(
      address,
      0,
      0,
      () => {
        printLog({
          type: 'info',
          message: '연결됨',
        });
      },
      (ev) => {

        printLog({
          type: 'info',
          message: '연결 종료: ' + ev.reason,
        });
      });
    socket.setOnMessage((data) => {
      printLog({
        type: 'receive',
        message: JSON.stringify(data),
      });
    });
    socket.setOnSend((data) => {
      printLog({
        type: 'send',
        message: JSON.stringify(data),
      });
    });

    setLectureSocket(socket);
  };

  return <div>
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <TextField
        id='standard-basic'
        label='웹소켓 서버 주소'
        variant='standard'
        defaultValue={address}
        onChange={(e) => setAddress(e.target.value)} />
      <Button onClick={handleConnect}>연결</Button>
      <Button onClick={() => {
        lectureSocket?.startLive();
      }}>start Live</Button>
      <Button onClick={() => {
        lectureSocket?.enterLive();
      }}>enter Live</Button>
      <Button onClick={() => {
        lectureSocket?.sdpOffer({ sdp: '테스트SDP', type: 'offer' });
      }}>sdp Offer</Button>
      <Button onClick={() => {
        lectureSocket?.sdpAnswer({ sdp: '테스트SDP', type: 'answer' });
      }}>sdp Answer</Button>
      <Button onClick={() => {
        lectureSocket?.exitLive();
      }}>exit Live</Button>
    </div>
    {messages.map((message, index) => (
      <div key={index}>
        {`[${message.type}]: ${message.message}`}
      </div>))}
  </div>;
};