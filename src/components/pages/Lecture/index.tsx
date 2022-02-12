import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LectureClient from '../../../libs/LectureClient';

export default function Lecture() {
  const naviagte = useNavigate();
  useEffect(() => {
    const client = new LectureClient(0, 0);
    client.requestRequiredPermission()
      .then(() => {
        
      }).catch((e) => {
        alert(e.message);
        naviagte('/');
      });
  }, []);
  return <></>;
}