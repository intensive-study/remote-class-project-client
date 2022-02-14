import React, { useContext } from 'react';
import LectureProvider, { LectureContext } from '../../../libs/LectureClient';
import { Button, Input } from '@mui/material';


function ConnectButtons() {
  const lecture = useContext(LectureContext);

  if (!lecture?.isConnected) {
    return <></>;
  }

  const handleStart = () => {
    lecture.startLive();
  };

  const handleEnter = () => {
    lecture.enterLive();
  };

  return <>
    {lecture.userId === lecture.teacherId ?
      <Button onClick={handleStart}>강의 시작</Button> :
      lecture.isLiveStarted ? <Button onClick={handleEnter}>강의실 접속</Button> : <></>}
  </>;
}

function Root() {
  const lecture = useContext(LectureContext);

  const handleConnect = () => {
    lecture.connect();
  };

  console.log(lecture.tracks.values());

  return <div>
    <Input
      defaultValue={1}
      onChange={(e) => lecture.setUserId(parseInt(e.target.value))} />
    <Button onClick={handleConnect}>연결</Button>
    <ConnectButtons />
    <div>
      {Array.from(lecture.tracks.values()).map((value, index) => {
        return <video ref={video => {
          if (video && value.stream) {
            video.srcObject = value.stream;
            video.play().then().catch(e => console.error);
          }
        }} key={index} />;
      })}
    </div>
  </div>;
}

export default function Lecture() {
  return <LectureProvider>
    <Root />
  </LectureProvider>;
};