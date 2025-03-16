'use client';

import React, { useRef, useEffect } from 'react';
import { usePeerStore } from '@/store';
import { usePeer } from '@/hooks';

const MyComponent = React.memo(() => {
  const { join, skip, send, end } = usePeer();
  const { localStreamRef, remoteStreamRef } = usePeerStore();

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (localStreamRef && localVideoRef.current) {
      localVideoRef.current.srcObject = localStreamRef;
    } else if (!localStreamRef && localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
  }, [localStreamRef]);

  useEffect(() => {
    if (remoteStreamRef && remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStreamRef;
    } else if (!remoteStreamRef && remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }
  }, [remoteStreamRef]);

  console.log('Component re-rendered');

  return (
    <div>
      <div>
        <video ref={localVideoRef} autoPlay muted playsInline />
      </div>
      <div>
        <video ref={remoteVideoRef} autoPlay playsInline />
      </div>
      <button onClick={join}>Join</button>
      <button onClick={skip}>Skip</button>
      <button onClick={end}>End</button>
      <form onSubmit={send}>
        <input type="text" />
        <button type="submit">Send</button>
      </form>
    </div>
  );
});

export default MyComponent;
